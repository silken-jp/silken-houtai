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

interface userLogin {
  _id: string;
  name: string;
  email: string;
  tel: string;
  is_cleanser: boolean;
  is_broker: boolean;
  is_creator: boolean;
  expiryDate: string;
}

interface OPTION {
  value: string;
  label: string;
}
