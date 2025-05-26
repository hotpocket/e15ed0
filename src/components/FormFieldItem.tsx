import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import clsx from "clsx";
import type { FormFieldItemProps } from "~/types/FormTypes";

const FormFieldItem: React.FC<FormFieldItemProps> = ({
  fieldData,
  onRemove,
  className,
  onClick,
}) => {
  const itemClasses = clsx(
    "flex flex-row justify-between p-3 rounded-xl transition-colors",
    {
      "border border-gray border-dashed hover:bg-sky-100 hover:cursor-pointer":
        fieldData.type !== "mapped",
      "border border-gray-400 bg-gray-200": fieldData.type === "mapped",
      "bg-sky-100": fieldData.selected && fieldData.type !== "mapped", // we should not be able to select something that is mapped
    },
    className,
  );

  return (
    <div
      className={itemClasses}
      onClick={() => {
        onClick?.(fieldData.name);
      }}
    >
      <div>
        <div>
          <span>
            {fieldData.type === "mapped"
              ? fieldData.mappedValue
              : fieldData.name}
          </span>
        </div>
      </div>
      {fieldData.type === "mapped" && (
        <Button
          icon="pi pi-times"
          className="w-auto! rounded-4xl! border-none! bg-gray-400! p-1.25! text-xs! hover:bg-red-300!"
          onClick={onRemove}
          aria-label={`Remove ${fieldData.name}`}
        />
      )}
    </div>
  );
};

export default FormFieldItem;
