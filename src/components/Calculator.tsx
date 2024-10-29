'use client'

import { InputText } from 'primereact/inputtext'
import React, { useEffect, useState } from 'react'
import pythagoreanMapping from '../data/pythagoreanMapping.json'
import chaldeanMapping from '../data/chaldeanMapping.json'

interface CalculationResult {
    vowels: number
    consonants: number
    total: number
    actual: number
}

const Calculator = () => {
    const defaultResult: CalculationResult = { vowels: 0, consonants: 0, total: 0, actual: 0 }
    const [name, setName] = useState<string>("")
    const [chaldeanValues, setChaldeanValues] = useState<CalculationResult>(defaultResult)
    const [pythagoreanValues, setPythagoreanValues] = useState<CalculationResult>(defaultResult)
    const [chaldeanLetterValues, setChaldeanLetterValues] = useState<string[]>([])
    const [pythagoreanLetterValues, setPythagoreanLetterValues] = useState<string[]>([])

    const cellStyle = "my-1 align-items-center justify-content-center h-2rem"
    const isVowel = (char: string) => 'aeiou'.includes(char)

    const loadMapping = (mode: string): Map<string, number> => {
        const data = mode === 'Chaldean' ? chaldeanMapping : pythagoreanMapping
        return new Map(Object.entries(data))
    }

    const reduceToSingleDigit = (num: number): number => {
        while (num > 9) {
            num = num
                .toString()
                .split('')
                .reduce((acc, digit) => acc + parseInt(digit, 10), 0)
        }
        return num
    }

    const calculateNumerology = (mode: string, name: string): CalculationResult => {
        const charMap = loadMapping(mode)
        let vowels = 0
        let consonants = 0
        let total = 0

        name.toLowerCase().split('').forEach((char) => {
            const value = charMap.get(char)
            if (value !== undefined) {
                if (isVowel(char)) vowels += value
                else consonants += value
                total += value
            }
        })

        return { vowels, consonants, total, actual: reduceToSingleDigit(total) }
    }

    const calculateLetterValues = (name: string) => {
        const chaldeanMap = loadMapping('Chaldean')
        const pythagoreanMap = loadMapping('Pythagorean')

        const getLetterValue = (char: string, map: Map<string, number>) => {
            return /^[a-zA-Z]$/.test(char) ? (map.get(char.toLowerCase()) || '').toString() : ''
        }

        setChaldeanLetterValues(name.split('').map((char) => getLetterValue(char, chaldeanMap)))
        setPythagoreanLetterValues(name.split('').map((char) => getLetterValue(char, pythagoreanMap)))
    }

    useEffect(() => {
        setChaldeanValues(calculateNumerology('Chaldean', name))
        setPythagoreanValues(calculateNumerology('Pythagorean', name))
        calculateLetterValues(name)
    }, [name])

    const renderLetterCell = (letter: string, chaldeanValue: string, pythagoreanValue: string) => (
        <div className='mx-1'>
            <div className={`${cellStyle} w-2rem flex ${isVowel(letter.toLowerCase()) ? "bg-red-100" : "bg-blue-100"}`}>{chaldeanValue}</div>
            <div className={`${cellStyle} w-2rem flex text-green-900 font-bold`}>{letter}</div>
            <div className={`${cellStyle} w-2rem flex ${isVowel(letter.toLowerCase()) ? "bg-red-100" : "bg-blue-100"}`}>{pythagoreanValue}</div>
        </div>
    )

    return (
        <div className='flex flex-column m-2 p-2 justify-content-center surface-200 border-round-md'>
            <label className='white-space-nowrap'>Enter name: </label>
            <InputText
                className='w-full mt-2'
                style={{ letterSpacing: "2px" }}
                value={name}
                onChange={(e) => setName(e.target.value.toUpperCase())}
            />
            <div className='mt-2 flex w-full surface-0 p-2 border-round-md overflow-auto'>
                <div className='mx-1'>
                    <div className={`${cellStyle} md:w-7rem font-semibold`}>Chaldean</div>
                    <div className={`${cellStyle} md:w-7rem font-semibold`}>Name</div>
                    <div className={`${cellStyle} md:w-7rem font-semibold`}>Pythagorean</div>
                </div>
                {name.split('').map((letter, index) =>
                    renderLetterCell(letter, chaldeanLetterValues[index], pythagoreanLetterValues[index])
                )}
                <div className='mx-1'>
                    <div className={`${cellStyle} w-5rem flex`}>Vowels</div>
                    <div className={`${cellStyle} w-5rem flex border-round-xl bg-red-200`}>{chaldeanValues.vowels}</div>
                    <div className={`${cellStyle} w-5rem flex border-round-xl bg-red-200`}>{pythagoreanValues.vowels}</div>
                </div>
                <div className='mx-1'>
                    <div className={`${cellStyle} w-5rem flex`}>Consonants</div>
                    <div className={`${cellStyle} w-5rem flex border-round-xl bg-blue-200`}>{chaldeanValues.consonants}</div>
                    <div className={`${cellStyle} w-5rem flex border-round-xl bg-blue-200`}>{pythagoreanValues.consonants}</div>
                </div>
                <div className='mx-1'>
                    <div className={`${cellStyle} w-5rem flex`}>Total</div>
                    <div className={`${cellStyle} w-5rem flex border-round-xl bg-green-200`}>{`${chaldeanValues.total} / ${chaldeanValues.actual}`}</div>
                    <div className={`${cellStyle} w-5rem flex border-round-xl bg-green-200`}>{`${pythagoreanValues.total} / ${pythagoreanValues.actual}`}</div>
                </div>
            </div>
        </div>
    )
}

export default Calculator