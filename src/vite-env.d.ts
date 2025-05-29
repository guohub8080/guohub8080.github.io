/// <reference types="vite/client" />
declare module '*.tsx'
declare module '*.jsx'
declare module '*.js'
declare module '*.ts'

declare module "*.svg" {
  import React from "react";
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}