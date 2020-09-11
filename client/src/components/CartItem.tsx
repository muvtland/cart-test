import React, {useState} from 'react'
import styles from './CartItem.module.css'
import {FaMinus, FaPlus, FaTrash} from 'react-icons/fa'


type CartItemType = {
    name: string,
    size: string,
    price: number,
    count: number,
    modal: any,
    modalType: any,
    totalPriceChange: any,
    setCurrentProductId: any,
    image: string,
    id: number
}

export default ({name, size, price, count, modal, modalType, image, totalPriceChange, id, setCurrentProductId}: CartItemType) => {
    const [localCount, setLocalCount] = useState(count)
    const [localPrice, setLocalPrice] = useState(price)


    const changeCount = (action: string) => {
        if (action === '-') {
            if (localCount > 1){
                fetch('/api/cart/count', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({count: count - 1, id, uuid: localStorage.getItem('uuid')})
                }).then(() => {
                    setLocalPrice(pre => {
                        return  pre - (price / count)
                    })
                    totalPriceChange((totalPrice: number) => {
                        return totalPrice - (price / count)
                    })
                    setLocalCount(localCount => {
                        return localCount - 1
                    })
                })
            }else {
                modalType('delete')
                setTimeout(() => {
                    setCurrentProductId(id)
                    modal(true)
                })
                return localCount
            }
        } else {
            fetch('/api/cart/count', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({count: count + 1, id, uuid: localStorage.getItem('uuid')})
            }).then(() => {
                setLocalPrice(pre => {
                   return  pre + (price / count)
                })
                totalPriceChange((totalPrice: number) => {
                    return totalPrice + (price / count)
                })
                setLocalCount(localCount => {
                    return localCount + 1
                })
            })
        }
    }

    return (
        <div className={styles.cartItem}>
            <div className={styles.left}>
                <div className={styles.img} style={{backgroundImage: `url(${image})`}}/>
                <div className={styles.info}>
                    <div className={styles.name}>{name}</div>
                    <div className={styles.size}>Размер: {size}</div>
                    <div className={styles.price}>{localPrice} руб.</div>
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.rightContainer}>
                    <div className={styles.minus} onClick={() => changeCount('-')}>{localCount < 2 ? <FaTrash/> :
                        <FaMinus/>}</div>
                    <div className={styles.count}>{localCount}</div>
                    <div className={styles.plus} onClick={() => changeCount('+')}><FaPlus/></div>
                </div>
            </div>
        </div>
    )
}