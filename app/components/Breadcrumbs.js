
import { Typography } from "@mui/material";
import { DrawerItems } from "./Drawer/DrawerItems";

/**
 * Generates breadcrumbs from path-url
 * @param {*} altTitle replacement title for current page
 * @param {*} path string containing path
 * @returns a list of Typography-elements
 * @todo use altTitle in result
 */
export default function WebsiteBreadcrumbs(altTitle, path) {
  let pathBits = path.split("/").filter((e) => e);
  pathBits = pathBits.slice(1, pathBits.length);

  const mapPath2Name = {};

  // creates map 
  DrawerItems.map((e) => (e.children ? [...e.children, e] : e))
    .flat()
    .map((e) => (mapPath2Name[`/${e.path}`] = e.name));

  //
  return pathBits.map((value, index) => {
    const path = `/${pathBits.slice(0, index + 1).join("/")}`;
    
    return (
      <Typography color="text.primary" key={path}>
        {mapPath2Name[path] ? mapPath2Name[path] : value}
      </Typography>
    );
  });
}