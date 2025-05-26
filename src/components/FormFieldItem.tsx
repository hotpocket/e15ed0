import React from "react";
import { Button } from "primereact/button";
import clsx from "clsx";
import type { FormFieldItemProps } from "~/types/FormTypes";

const FormFieldItem: React.FC<FormFieldItemProps> = ({
  name,
  variant = "default",
  onRemove,
  className,
  formData,
  renderTree,
}) => {
  const itemClasses = clsx(
    "flex flex-row justify-between p-3 rounded-xl transition-colors",
    {
      "border border-gray border-dashed hover:bg-sky-100 hover:cursor-pointer":
        variant === "unmapped",
      "border border-gray-400 bg-gray-200": variant === "mapped",
    },
    className,
  );

  function handleOnClick() {
    renderTree(formData);
  }

  return (
    <div className={itemClasses} onClick={handleOnClick}>
      <div className="align-items-center flex">
        <div>
          <span className="text-color font-medium">{name}</span>
        </div>
      </div>
      {variant === "mapped" && (
        <Button
          icon="pi pi-times"
          className="w-auto! rounded-4xl! border-none! bg-gray-400! p-1.25! text-xs! hover:bg-red-300!"
          onClick={onRemove}
          aria-label={`Remove ${name}`}
        />
      )}
    </div>
  );
};

export default FormFieldItem;
