/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useState,
  cloneElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { Popover, MenuList, type PopoverOrigin } from "@mui/material";
import { menuListStyles } from "./styles";

interface Props {
  trigger: ReactElement<any>;
  children: ReactNode;
  onClose?: () => void;
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
  width?: string;
}

export function PopoverMenu({
  trigger,
  children,
  onClose,
  anchorOrigin = { vertical: "bottom", horizontal: "right" },
  transformOrigin = { vertical: "top", horizontal: "right" },
  width,
}: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const closeMenu = () => {
    setAnchorEl(null);
    onClose?.();
  };

  return (
    <>
      {cloneElement(trigger, {
        onClick: (e: any) => {
          e.stopPropagation();
          setAnchorEl(e.currentTarget);
          trigger.props.onClick?.(e);
        },
      })}
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={closeMenu}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
      >
        <MenuList
          sx={{
            ...menuListStyles,
            width: width ?? "auto",
          }}
        >
          {Array.isArray(children)
            ? children.map((child, i) =>
                cloneElement(child as any, { closeMenu, key: i })
              )
            : cloneElement(children as any, { closeMenu })}
        </MenuList>
      </Popover>
    </>
  );
}
