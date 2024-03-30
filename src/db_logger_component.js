import { useIndexedDB } from 'react-indexed-db-hook';

export default function PanelExample() {
  const db = useIndexedDB('district');

  return (<div>{'No data'}</div>);
}