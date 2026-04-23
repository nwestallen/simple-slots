const payOuts = new Map([
    ["🎰🎰🎰", 1000],
    ["🍀🍀🍀", 500],
    ["🔔🔔🔔", 250],
    ["🍒🍒🍒", 100],
    ["🍇🍇🍇", 75],
    ["🍊🍊🍊", 50],
    ["🍋🍋🍋", 25]
])

export const PayTable = () => {
    return(
        <div className='bg-white text-2xl font-bold p-4 rounded-sm'>
        <table>
            <thead>
                <tr className='pb-16'>
                    <th className='pr-8 border border-black px-2 py-1'>Combination</th>
                    <th className='border border-black px-2 py-1'>Payout</th>
                </tr>
            </thead>
            <tbody>
                {[...payOuts].map(([k, v]) => (
                    <tr>
                        <td className="p-1 border border-black">{k}</td>
                        <td className="p-1 border border-black">{v}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    )
}