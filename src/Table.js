import React from 'react'
import './Table.css'
import numeral from 'numeral'

function Table({countries}) {
    var a=1
    return (
        <div className="table">
            {
                countries.map(({country,cases})=>(
                    <tr>
                        <td>{a++}</td>
                        <td>{country}</td>
                        <td><strong>{numeral(cases).format('0,0')}</strong></td>
                    </tr>
                ))
            }
        </div>
    )
}

export default Table
