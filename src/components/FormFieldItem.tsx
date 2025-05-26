import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import clsx from "clsx";
import type { FormFieldItemProps } from "~/types/FormTypes";

const FormFieldItem: React.FC<FormFieldItemProps> = ({
  name,
  variant = "default",
  onRemove,
  className,
  selected,
  onClick,
}) => {
  const [clickedItem, setClickedItem] = useState("");

  const itemClasses = clsx(
    "flex flex-row justify-between p-3 rounded-xl transition-colors",
    {
      "border border-gray border-dashed hover:bg-sky-100 hover:cursor-pointer":
        variant === "unmapped",
      "border border-gray-400 bg-gray-200": variant === "mapped",
      "bg-sky-100": selected,
    },
    className,
  );

  return (
    <div
      className={itemClasses}
      onClick={() => {
        onClick?.(name);
      }}
    >
      <div>
        <div>
          <span>{name}</span>
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
