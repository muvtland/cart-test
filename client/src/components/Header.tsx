import React from 'react'
import style from './Header.module.css'
import { FaShoppingCart } from 'react-icons/fa'

type HeaderProp = {
    count: number
}

export default ({ count }: HeaderProp) => {
    return(
        <div className={style.header}>
            <div className={style.container}>
                <div className={style.cart}>
                    <FaShoppingCart size={'3em'}/>
                    <span>{ count}</span>
                </div>
            </div>
        </div>

    )
}