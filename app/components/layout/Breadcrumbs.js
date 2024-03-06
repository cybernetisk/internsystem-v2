
import { Typography } from "@mui/material";
import Link from "next/link";

/**
 * Generates breadcrumbs from path-url
 * @param {*} path string containing path
 * @param {*} navItems A list of objects with {id, path, name, icon}
 * @returns a list of Typography-elements which link to pages
 */
export default function WebsiteBreadcrumbs(path, navItems) {

  let pathBits = path.split("/").filter((e) => e);
  pathBits = pathBits.slice(1, pathBits.length);

  const mapPath2Name = {};
  
  // creates map
  navItems.map((e) => (e.children ? [...e.children, e] : e))
    .flat()
    .map((e) => (mapPath2Name[`/${e.path}`] = e.name));
  
  //
  pathBits = pathBits.map((value, index) => {
    const path = `/${pathBits.slice(0, index + 1).join("/")}`;

    return (
      <Link key={"link_" + path} href={"/pages/" + path}>
        <Typography
          color="text.primary"
          variant="body2"
          key={"typography" + path}
          alignSelf="center"
        >
          {mapPath2Name[path] ? mapPath2Name[path] : value}
        </Typography>
      </Link>
    );
  });

  return [<Typography key={"empty_crumb"}></Typography>, ...pathBits];
}