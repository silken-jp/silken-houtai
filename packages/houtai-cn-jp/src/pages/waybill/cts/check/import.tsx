import React from 'react';

export interface ImporterProps {}

const Importer: React.FC<ImporterProps> = () => {
  const [state, setState] = React.useState<any>();

  React.useEffect(() => {
    let channel = new window.BroadcastChannel('sk_import');
    channel.onmessage = (e) => {
      setState(e.data);
    };
    channel.onmessageerror = (ev) => {
      throw new Error('BroadcastChannel Error while deserializing: ' + ev.origin);
    };
    return () => channel?.close();
  }, []);
  return (
    <>
      <object data={state?.url} type="application/pdf" width="100%" height="100%">
        <iframe src={state?.url} width="100%" height="100%">
          <p>
            <b>表示されない時の表示</b>
          </p>
        </iframe>
      </object>
    </>
  );
};

export default Importer;
