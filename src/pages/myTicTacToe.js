/**
 * @const Tablero, Renderiza el componente tablero (‘Con 9 componentes Cuadro’) del juego Tic Tac Toe.
 *
 * @version       4.0
 *
 * @author        Mario Arita <marioarita502@gmail.com>
 *
 * History
 * v4.0 - Se agregaron alertas con useContext, se agrego el componente puntaje, se mejoraron la funciones de animacion, se mejoraron estilos del tablero y se agrego el estilo de fuente de manera local.
 * v3.0 – Se agrego la función calculaGanador, se agrego el button reset y se agregaron nuevas animaciones en el tailwind.config.js.
 * v2.0 – Se se mejoró el diseño y la distribuicion del tablero y se agrego la función pintaFigura.
 * v1.0 – Se implementaron los componentes del tablero 'Cuadro' inicialmente con div's.
 * ----
 */

import React, { useState, useContext } from 'react'
import { AlertContext } from '../context/AlertProvider'
import Tablero from '../components/tablero'
import Resetear from '../components/resetear'
import Puntajes from '../components/puntajes'

const MyTicTacToe = () => {
  const [cuadros, setCuadros] = useState(Array(9).fill(''))
  const [turno, setTurno] = useState('X')
  const [animacion, setAnimacion] = useState(false)
  const [puntaje, setPuntaje] = useState({ puntajeX: 0, puntajeO: 0 })

  const [posiciones, setPosiciones] = useState([]) //Costante para almacenar la lista de posiciones ganadoras
  const [gameOver, setGameOver] = useState(false) //Constante para definir si el juego aun continua o ha finalizado

  const alert = useContext(AlertContext)

  //1. Funcion al hacer click en cualquier cuadro del tablero
  const pintaFigura = (indexItem) => {
    const misCuadritos = cuadros.slice()
    misCuadritos.splice(indexItem, 1, turno)

    //Si el cuadro esta vacio y el juego aun no a terminado; permitir llenar
    if (gameOver === false) {
      if (cuadros[indexItem] === '') {
        setCuadros(misCuadritos)
        if (turno === 'X') {
          setTurno('O')
        } else {
          setTurno('X')
        }
        setAnimacion(false)
        const nuevoGanador = calculaGanador(misCuadritos)
        if (nuevoGanador) {
          if (nuevoGanador === 'O') {
            let { puntajeO } = puntaje
            puntajeO += 1
            setPuntaje({ ...puntaje, puntajeO })
          } else {
            let { puntajeX } = puntaje
            puntajeX += 1
            setPuntaje({ ...puntaje, puntajeX })
          }
        }
      } //De lo contario sacudir
      else {
        alert.show(
          '¡ ATENCIÓN !',
          `El cuadro ${indexItem + 1} ya tiene un valor, intente con otro.`
        )
        setAnimacion(true)
        setTimeout(() => setAnimacion(false), 700)
      }
    } else {
      alert.show('¡ ATENCIÓN !', 'El juego ya ha terminado.')
    }
  }

  //2. Calcular si dentro del tablero hay un ganador
  const calculaGanador = (myTablero) => {
    const jugadasGanadoras = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    for (
      let indiceJugada = 0;
      indiceJugada < jugadasGanadoras.length;
      indiceJugada++
    ) {
      const [a, b, c] = jugadasGanadoras[indiceJugada]
      if (
        myTablero[a] &&
        myTablero[a] === myTablero[b] &&
        myTablero[a] === myTablero[c]
      ) {
        //El juego a terminado ('no mas entradas')
        setGameOver(true)
        setPosiciones(jugadasGanadoras[indiceJugada])
        setTimeout(() => restablecerTablero(), 4000)
        alert.show('¡ HAY UN GANADOR !', `El ganador a sido → ${myTablero[a]}`)
        return myTablero[a]
      }
    }
  }

  // // 3. Restablecer tablero con valor vacios y El gameOver en false
  const restablecerTablero = () => {
    setGameOver(false) // Un nuevo juego comienza
    setAnimacion(false)
    setPosiciones([])
    setCuadros(Array(9).fill('')) // Sin ningún valor en los componentes ‘Cuadro’
  }

  return (
    <div className="flex flex-col bg-neutral-800 items-center justify-center min-h-screen">
      <div className="grow-1">
        <Puntajes puntaje={puntaje} turno={turno} />
        <Tablero
          cuadros={cuadros}
          animacion={animacion}
          alHacerClick={pintaFigura}
          posiciones={posiciones}
        />
        <Resetear restablecerTablero={restablecerTablero} />
      </div>
    </div>
  )
}

export default MyTicTacToe
