import requests
import os
import json
from urllib.parse import urlparse, urljoin

def download_schema_recursive(start_url, base_download_dir="schemas"):
    """
    Recursively downloads a JSON schema and all its external $ref dependencies.

    Args:
        start_url (str): The URL of the initial schema.
        base_download_dir (str): The base directory to save downloaded schemas.
    """
    if not os.path.exists(base_download_dir):
        os.makedirs(base_download_dir)

    queue = [start_url]
    processed_urls = set()
    downloaded_files = {} # To map original URL to local path

    while queue:
        current_url = queue.pop(0)

        if current_url in processed_urls:
            continue

        print(f"Processing: {current_url}")
        processed_urls.add(current_url)

        try:
            response = requests.get(current_url)
            response.raise_for_status() # Raise an exception for HTTP errors
            schema_content = response.json()

            # Determine local file path
            parsed_url = urlparse(current_url)
            # Use path components to create subdirectories if needed
            # For simplicity, let's just use the last part as filename here
            filename = os.path.basename(parsed_url.path)
            if not filename: # Handle cases like '.../schemas/'
                filename = "index.json" # Or some other default
            local_filepath = os.path.join(base_download_dir, filename)

            # Check for name collisions (simple approach for now)
            counter = 1
            original_filename = filename
            while os.path.exists(local_filepath):
                name, ext = os.path.splitext(original_filename)
                filename = f"{name}_{counter}{ext}"
                local_filepath = os.path.join(base_download_dir, filename)
                counter += 1

            with open(local_filepath, 'w', encoding='utf-8') as f:
                json.dump(schema_content, f, indent=2, ensure_ascii=False)
            print(f"Downloaded: {current_url} to {local_filepath}")
            downloaded_files[current_url] = local_filepath

            # Find and queue new $ref URLs
            def find_refs(node, base_url):
                if isinstance(node, dict):
                    if "$ref" in node:
                        ref_value = node["$ref"]
                        # Resolve relative references
                        full_ref_url = urljoin(base_url, ref_value)
                        # Only consider external HTTP/HTTPS URLs for new downloads
                        if full_ref_url.startswith("http://") or full_ref_url.startswith("https://"):
                            # Filter out local fragments if they don't involve new base URLs
                            if "#" in full_ref_url and full_ref_url.split('#')[0] == base_url.split('#')[0]:
                                pass # This is a local fragment, don't re-queue the same file
                            else:
                                if full_ref_url not in processed_urls:
                                    queue.append(full_ref_url)
                    for key, value in node.items():
                        find_refs(value, base_url) # Pass current schema's URL as base for relative refs
                elif isinstance(node, list):
                    for item in node:
                        find_refs(item, base_url)

            find_refs(schema_content, current_url)

        except requests.exceptions.RequestException as e:
            print(f"Error downloading {current_url}: {e}")
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON from {current_url}: {e}")

    print("\n--- Download complete ---")
    print("Downloaded Schemas:")
    for original_url, local_path in downloaded_files.items():
        print(f"- {original_url} -> {local_path}")

# Example usage:
# Make sure to replace this with your actual URL
root_schema_url = "https://api.avantos-dev.io/schemas/ActionBlueprintGraphDescription"
download_schema_recursive(root_schema_url, base_download_dir="./avantos_schemas")
