import { useReelContext } from "../ReelContext";

export const ReelSettings = () => {
  const { rowCount, setRowCount } = useReelContext();
  return(
    <div className='mt-16 mx-16 flex flex-col bg-slate-500 p-4 rounded-lg'>
      <h2 className='text-white text-3xl font-bold mb-2'>Settings</h2>
    <div className='m-2'>
    <label htmlFor='rows' className='text-white font-bold'>Rows: </label>
    <input 
    id='rows'
    className='bg-white text-center w-1/2 rounded-sm'
    type='number' value={rowCount} onChange={e => setRowCount(Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)} />
    </div>
    </div>
  );
}