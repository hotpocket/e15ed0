import React, { useState, useCallback, useMemo } from "react";
import { Panel } from "primereact/panel";
import { InputSwitch } from "primereact/inputswitch";
import { Tree } from "primereact/tree";
import { Button } from "primereact/button";
import type { TreeNode } from "primereact/treenode";
import type { InputSwitchChangeEvent } from "primereact/inputswitch";
import type { PrefilFormProps, FormItem, FormData } from "~/types/FormTypes";
import { useFormItems } from "~/hooks/useFormItems";
import FormFieldItem from "~/components/FormFieldItem";

const PrefilForm: React.FC<PrefilFormProps> = ({
  initialItems = [],
  onEnabledChange,
  className,
  formData,
}) => {
  // start component logic
  const [enabled, setEnabled] = useState<boolean>(true);
  const { items, updateItem, setItems, getItem } = useFormItems(initialItems);
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([]);
  const [hasDeps, setHasDeps] = useState<boolean>(true);
  const [mapText, setMapText] = useState("");
  const [selectedFormItem, setSelectedFormItem] = useState("");
  const [selectedTreeNode, setSelectedTreeNode] = useState([] as TreeNode);

  const handleEnabledChange = useCallback(
    (e: InputSwitchChangeEvent): void => {
      const value = e.value;
      setEnabled(value);
      onEnabledChange?.(value);
    },
    [onEnabledChange],
  );

  const headerTemplate = useMemo(
    (): React.ReactElement => (
      <div className="align-items-start flex w-full justify-between">
        <div>
          <p className="text-color-secondary m-0 mt-1">
            Prefill fields for this form
          </p>
        </div>
        <div>
          <InputSwitch checked={enabled} onChange={handleEnabledChange} />
        </div>
      </div>
    ),
    [enabled, handleEnabledChange],
  );

  const handleRemoveItem = useCallback(
    (name: string): void => {
      updateItem(name, {
        mappedValue: undefined,
        selected: false,
        type: "unmapped",
      });
    },
    [updateItem],
  );

  function renderDepTree(formData: FormData) {
    /*
    id?: string | undefined;
    key?: string | number | undefined;
    label?: string | undefined;
    data?: any | undefined;
    icon?: IconType<TreeNode> | undefined;
    children?: TreeNode[] | undefined;
    style?: React.CSSProperties | undefined;
    className?: string | undefined;
    droppable?: boolean | undefined;
    draggable?: boolean | undefined;
    selectable?: boolean | undefined;
    leaf?: boolean | undefined;
    expanded?: boolean | undefined;

*/
    function iterateDeps(depObj: Record<string, string[]>): TreeNode[] {
      return Object.keys(depObj).map((key) => {
        const label: string = key;
        const children: TreeNode[] = depObj[key]!.map((el) => ({
          label: el,
          key: `${key}.${el}`, // without this they will ALL expand when one is expanded ...
          leaf: true,
        }));
        return { key: label, leaf: false, label, children };
      });
    }

    const allTreeNodes: TreeNode[] = [];

    allTreeNodes.push(...iterateDeps(formData.direct_dependencies));
    allTreeNodes.push(...iterateDeps(formData.transient_dependencies));

    // could sort by name instead of listing direct deps first.  if so uncomment below
    // allTreeNodes = allTreeNodes.sort((a, b) =>
    //   a.label!.localeCompare(b.label!),
    // );

    // console.log(allTreeNodes);

    setTreeNodes(allTreeNodes);
    setHasDeps(allTreeNodes.length > 0);
    console.log(allTreeNodes);
  }

  // unhighlight the last click & highlight the current click so the user has UI feedback
  // as to the form item they are currently selecting a prefill mapping for
  function handleFormItemClick(fieldName: string) {
    // fields that are already mapped/prefilled shouldn't be selectable
    // console.log(getItem(fieldName));
    if (getItem(fieldName).type === "mapped") return;
    // console.log(`Selecting ${fieldName}`);

    setMapText("");
    setSelectedFormItem(fieldName);
    setItems(
      // set flag to highlight selected form field item
      items.map((formItem: FormItem) => {
        return formItem.name === fieldName
          ? { ...formItem, selected: true }
          : { ...formItem, selected: false };
      }),
    );
    // intentionally not collapsing the tree if it was expenced before.
    // we may want to map multiple fields ...
    renderDepTree(formData);
  }

  function onPrefillSelect(treeNode: TreeNode) {
    if (!treeNode.leaf) {
      setMapText("");
      return;
    }
    setSelectedTreeNode(treeNode);
    setMapText(`Map ${selectedFormItem}  to  ${treeNode.key}`);
  }

  function mapPrefillFormData() {
    updateItem(selectedFormItem, {
      type: "mapped",
      mappedValue: `${selectedFormItem}: ${selectedTreeNode.key}`,
    });
    setSelectedTreeNode([] as TreeNode);
    setMapText("");
  }

  return (
    <Panel
      headerTemplate={() => headerTemplate}
      className={className}
      pt={{
        content: { className: "rounded-md outline-gray-300 outline" },
      }}
    >
      <div className="flex flex-col gap-3">
        {items.map((item: FormItem) => (
          <FormFieldItem
            key={item.name}
            fieldData={item}
            onClick={handleFormItemClick}
            onRemove={() => handleRemoveItem(item.name)}
          />
        ))}
      </div>
      {treeNodes && treeNodes.length > 0 && (
        <>
          <div>
            <span className="float-left pt-10 pl-6 text-2xl font-bold">
              Prefill Sources
            </span>
            {mapText !== "" && (
              <span className="float-right p-8 pr-10">
                <Button onClick={mapPrefillFormData}>{mapText}</Button>
              </span>
            )}
          </div>
          <Tree
            onSelect={(e) => onPrefillSelect(e.node)}
            onCollapse={() => setMapText("")}
            onExpand={() => setMapText("")}
            selectionMode="single"
            value={treeNodes}
            filter
            filterMode="strict"
            filterPlaceholder="Strict Filter"
            className="md:w-30rem mt-24! w-full"
          />
        </>
      )}
      {!hasDeps && (
        <div className={"p-10 text-center text-2xl font-bold"}>
          No dependency / inherritence data found
        </div>
      )}
    </Panel>
  );
};

export default PrefilForm;
