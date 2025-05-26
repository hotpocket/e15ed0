import React, { useState, useCallback, useMemo } from "react";
import { Panel } from "primereact/panel";
import { InputSwitch } from "primereact/inputswitch";
import { Tree } from "primereact/tree";
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
  const { items, updateItem, setItems } = useFormItems(initialItems);
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([]);
  const [hasDeps, setHasDeps] = useState<boolean>(true);

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
      updateItem(name, { mappedValue: undefined, selected: false });
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
        const children: TreeNode[] = depObj[key]!.map((el) => ({ label: el }));
        return { label, children };
      });
    }

    const allTreeNodes: TreeNode[] = [];
    allTreeNodes.push(...iterateDeps(formData.direct_dependencies));
    allTreeNodes.push(...iterateDeps(formData.transient_dependencies));

    // could sort by name instead of listing direct deps first.  if so uncomment below
    // allTreeNodes = allTreeNodes.sort((a, b) =>
    //   a.label!.localeCompare(b.label!),
    // );

    console.log(allTreeNodes);

    setTreeNodes(allTreeNodes);
    setHasDeps(allTreeNodes.length > 0);
    // get formData & render tree w/ that data
    // direct_dependencies
    console.log(formData);
    console.log(formData.direct_dependencies);
    console.log(formData.transient_dependencies);
  }

  // unhighlight the last click & highlight this click so the user has UI feedback
  // as to the form item they are currently selecting a prefill mapping for
  function handleFormItemClick(fieldName: string) {
    renderDepTree(formData);
    setItems(
      items.map((formItem: FormItem) => {
        return formItem.name === fieldName
          ? { ...formItem, selected: true }
          : { ...formItem, selected: false };
      }),
    );
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
            onClick={handleFormItemClick}
            selected={item.selected}
            key={item.name}
            name={item.name}
            variant={item.type}
            onRemove={() => handleRemoveItem(item.name)}
          />
        ))}
      </div>
      {treeNodes && treeNodes.length > 0 && (
        <>
          <div className="mt-5 text-xl font-bold">Prefill Sources</div>
          <Tree
            value={treeNodes}
            filter
            filterMode="strict"
            filterPlaceholder="Strict Filter"
            className="md:w-30rem mt-5! w-full"
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
