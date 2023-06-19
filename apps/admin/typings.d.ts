declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>,
  ): React.ReactElement;
  const url: string;
  export default url;
}

interface userLogin extends API.User {
  expiryDate: string;
}

interface OPTION {
  value: string;
  label: string;
}
