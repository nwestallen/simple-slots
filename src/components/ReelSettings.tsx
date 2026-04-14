import { useReelContext } from "../ReelContext";

export const ReelSettings = () => {
  const { rowCount, setRowCount } = useReelContext();
  return(
    <div>
    <label htmlFor='rows'>Rows: </label>
    <input 
    id='rows'
    className='bg-white text-center m-8 w-1/2 border border-red-500'
    type='number' value={rowCount} onChange={e => setRowCount(Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)} />
    </div>
  );
}