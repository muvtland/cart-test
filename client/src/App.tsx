import React, {useEffect, useState} from 'react'
import './App.css'
import Header from './components/Header'
import CartTitle from './components/CartTitle'
import CartItem from './components/CartItem'
import Modal from './components/Modal'
import {v4 as uuidv4} from 'uuid'
import {BiLoaderCircle} from 'react-icons/bi'


type Product = {
    id: string,
    name: string,
    price: number,
    image: string,
    count: number,
    size: string
}


export default () => {
    const [uuidStr, setUuidStr] = useState(localStorage.getItem('uuid'))
    const [modal, setModal] = useState(false)
    const [modalType, setModalType] = useState('clear')
    const [modalText, setModalText] = useState('Вы действительно хотите очистить корзину?')
    const [modalAcceptText, setModalAcceptText] = useState('Очистит')
    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [currentProductId, setCurrentProductId] = useState(null)
    useEffect(() => {
        //componentDitMount
        let uuIdExist
        if (!uuidStr) {
            uuIdExist = uuidv4()
            setUuidStr(uuIdExist)
            localStorage.setItem('uuid', uuIdExist)
        } else {
            uuIdExist = uuidStr
        }
        console.log('uuIdExist', uuIdExist)
        setLoading(true)
        fetch(`/api/cart/${uuIdExist}`,).then(response => response.json()).then(data => {
            let fetchTotalPrice = 0
            data.forEach((product: Product) => fetchTotalPrice += (product.price * product.count))
            setTotalPrice(fetchTotalPrice)
            setProducts(data)
            setLoading(false)
        })
    }, [])


    useEffect(() => {
        if (modalType !== 'clear') {
            setModalText('Удалить продукт из списка?')
            setModalAcceptText('Удалить')
        } else {
            setModalText('Вы действительно хотите очистить корзину?')
            setModalAcceptText('Очистит')
        }
    }, [modalType])


    const cartClear = () => {
        setLoading(true)
        fetch('/api/cart/clear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({uuid: uuidStr})
        }).then(() => {
            setTotalPrice(0)
            setProducts([])
            setModal(false)
            setLoading(false)
        })
    }

    const productDelete = () => {
        setLoading(true)
        fetch('/api/cart/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({uuid: uuidStr, id: currentProductId})
        }).then(response => response.json()).then(data => {
            let fetchTotalPrice = 0
            data.forEach((product: Product) => fetchTotalPrice += (product.price * product.count))
            setTotalPrice(fetchTotalPrice)
            setProducts(data)
            setModal(false)
            setLoading(false)
        })
    }

    const modalAccept = modalType === 'clear' ? cartClear : productDelete

    const clearCartButton = () => {
        setModalType('clear')
        setTimeout(() => {
            setModal(true)
        })
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <BiLoaderCircle/>
            </div>
        )
    }


    return (
        <div className={'container'}>
            <Header count={products.length}/>
            <div className={'content'}>
                <CartTitle count={products.length} totalPrice={totalPrice}/>
                <div className={'cart-items'}>
                    {
                        products.map((product, index) => {
                            const {image, name, price, size, count, id} = product
                            return <CartItem count={count} size={size} name={name} price={price * count} key={id}
                                             modal={setModal} modalType={setModalType} image={image} id={id}
                                             totalPriceChange={setTotalPrice}
                                             setCurrentProductId={setCurrentProductId}/>
                        })
                    }
                </div>
                <button className={'clear'} onClick={clearCartButton}>Очистить корзину</button>
            </div>
            {modal &&
            <Modal text={modalText} buttonAcceptText={modalAcceptText} accept={modalAccept} cancel={setModal}/>}
        </div>
    )
}
