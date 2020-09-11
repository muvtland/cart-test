import React from 'react'
import style from './CartTitle.module.css'

type CartTitleType = {
    count: number,
    totalPrice: number
}

export default ({count, totalPrice}: CartTitleType) => {
    return(
        <div className={style.title}>
            <h4 className={style.count}>
                Корзина
                <span>{count}</span>
            </h4>
            <h5 className={style.price}>
                {totalPrice} руб.
            </h5>
        </div>
    )
}