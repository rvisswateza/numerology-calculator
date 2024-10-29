'use client'

import { InputText } from 'primereact/inputtext'
import React, { useEffect, useState } from 'react'
import pythagoreanMapping from '../data/pythagoreanMapping.json';
import chaldeanMapping from '../data/chaldeanMapping.json';

interface CalculationResult {
    vowels: number;
    consonants: number;
    total: number;
    actual: number;
}


const Calculator = () => {

    const defaultResult: CalculationResult = {
        vowels: 0,
        consonants: 0,
        total: 0,
        actual: 0
    }
    const [name, setName] = useState<string>("");
    const [chaldeanValues, setChaldeanValues] = useState<CalculationResult>(defaultResult);
    const [pythagoreanValues, setPythagoreanValues] = useState<CalculationResult>(defaultResult);
    const [chaldeanLetterValues, setChaldeanLetterValues] = useState<string[]>([]);
    const [pythagoreanLetterValues, setPythagoreanLetterValues] = useState<string[]>([]);

    const cellStyle = "my-1 flex align-items-center justify-content-center h-2rem"

    const loadMapping = (mode: string): Map<string, number> => {
        const data = mode === 'Chaldean' ? chaldeanMapping : pythagoreanMapping;
        return new Map(Object.entries(data));
    };

    const isVowel = (char: string): boolean => {
        return 'aeiou'.includes(char);
    };

    const reduceToSingleDigit = (num: number): number => {
        while (num > 9) {
            num = num
                .toString()
                .split('')
                .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
        }
        return num;
    };

    const calculateNumerology = (mode: string, name: string): CalculationResult => {
        const charMap = loadMapping(mode);
        let vowels = 0;
        let consonants = 0;
        let total = 0;

        name.toLowerCase().split('').forEach((char) => {
            if (!isNaN(Number(char))) {
                total += Number(char);
            } else {
                const value = charMap.get(char);
                if (value !== undefined) {
                    if (isVowel(char)) {
                        vowels += value;
                    } else {
                        consonants += value;
                    }
                    total += value;
                }
            }
        });

        const actual = reduceToSingleDigit(total);

        return {
            vowels,
            consonants,
            total,
            actual
        };
    };

    const calculateLetterValues = (name: string) => {
        const chaldeanMap = loadMapping('Chaldean');
        const pythagoreanMap = loadMapping('Pythagorean');
    
        const isAlphabet = (char: string) => /^[a-zA-Z]$/.test(char); // Regex to check if the character is an alphabet
    
        const chaldeanValues = name.toLowerCase().split('').map((char) => 
            isAlphabet(char) ? (chaldeanMap.get(char) || '').toString() : ''
        );
    
        const pythagoreanValues = name.toLowerCase().split('').map((char) => 
            isAlphabet(char) ? (pythagoreanMap.get(char) || '').toString() : ''
        );
    
        setChaldeanLetterValues(chaldeanValues);
        setPythagoreanLetterValues(pythagoreanValues);
    };
    

    useEffect(() => {
        setChaldeanValues(calculateNumerology('Chaldean', name.toLowerCase()))
        setPythagoreanValues(calculateNumerology('Pythagorean', name.toLowerCase()))
        calculateLetterValues(name)
    }, [name])

    return (
        <div className='flex flex-column m-2 p-2 justify-content-center surface-200 border-round-md' >
            <label className='white-space-nowrap'>Enter name: </label>
            <InputText className='w-full mt-2' style={{ letterSpacing: "2px" }} value={name} onChange={(e) => { setName(e.target.value.toUpperCase()) }} />
            <div className='mt-2 flex w-full surface-0 p-2 border-round-md overflow-auto'>
                <div className='mx-1 justify-content-start'>
                    <div className={`${cellStyle}`}> </div>
                    <div className={`${cellStyle}`}>Chaldean</div>
                    <div className={`${cellStyle}`}>Name</div>
                    <div className={`${cellStyle}`}>Pythagorean</div>
                </div>
                {/* Display values of each letter of the name */}
                {name.split('').map((letter, index) => (
                    <div key={index} className='mx-1'>
                        <div className={`${cellStyle} mx-1`}></div>
                        <div className={`${cellStyle} mx-1`}>{chaldeanLetterValues[index]}</div>
                        <div className={`${cellStyle} mx-1`}>{letter}</div>
                        <div className={`${cellStyle} mx-1`}>{pythagoreanLetterValues[index]}</div>
                    </div>
                ))}
                <div className='mx-1'>
                    <div className={`${cellStyle}`}>Vowels</div>
                    <div className={`${cellStyle}`}>{chaldeanValues.vowels}</div>
                    <div className={`${cellStyle}`}></div>
                    <div className={`${cellStyle}`}>{pythagoreanValues.vowels}</div>
                </div>
                <div className='mx-1'>
                    <div className={`${cellStyle}`}>Consonants</div>
                    <div className={`${cellStyle}`}>{chaldeanValues.consonants}</div>
                    <div className={`${cellStyle}`}></div>
                    <div className={`${cellStyle}`}>{pythagoreanValues.consonants}</div>
                </div>
                <div className='mx-1 justify-content-end'>
                    <div className={`${cellStyle}`}>Total</div>
                    <div className={`${cellStyle}`}>{chaldeanValues.total}</div>
                    <div className={`${cellStyle}`}></div>
                    <div className={`${cellStyle}`}>{pythagoreanValues.total}</div>
                </div>
            </div>
            {/* <table className='mt-2 p-2'>
                <thead>
                    <tr><td className='font-bold'>System</td><td className='font-bold'>Chaldean</td><td className='font-bold'>Pythagorean</td></tr>
                </thead>
                <tbody>
                    <tr><td>Vowels</td><td>{chaldeanValues.vowels}</td><td>{pythagoreanValues.vowels}</td></tr>
                    <tr><td>Consonants</td><td>{chaldeanValues.consonants}</td><td>{pythagoreanValues.consonants}</td></tr>
                    <tr><td>Total</td><td>{chaldeanValues.total}</td><td>{pythagoreanValues.total}</td></tr>
                    <tr><td>Actual</td><td>{chaldeanValues.actual}</td><td>{pythagoreanValues.actual}</td></tr>
                </tbody>
            </table> */}
        </div>
    )
}

export default Calculator