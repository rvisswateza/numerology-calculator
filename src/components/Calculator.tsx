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

    const cellStyle = "my-1 align-items-center justify-content-center h-2rem"

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
                    <div className={`${cellStyle} md:w-7rem`}> </div>
                    <div className={`${cellStyle} font-semibold hidden md:flex md:w-7rem`}>Chaldean</div>
                    <div className={`${cellStyle} font-semibold flex w-1rem md:hidden`}>C</div>
                    <div className={`${cellStyle} font-semibold hidden md:flex md:w-7rem`}>Name</div>
                    <div className={`${cellStyle} font-semibold hidden md:flex md:w-7rem`}>Pythagorean</div>
                    <div className={`${cellStyle} font-semibold flex w-1rem md:hidden`}>P</div>
                </div>
                {/* Display values of each letter of the name */}
                {name.split('').map((letter, index) => (
                    <div key={index} className='hidden md:block'>
                        <div className={`${cellStyle} w-2rem flex`}></div>
                        <div className={`${cellStyle} w-2rem flex border-0 border-round-2xl ${isVowel(letter.toLowerCase()) ? "bg-red-100" : "bg-blue-100" }`}>{chaldeanLetterValues[index]}</div>
                        <div className={`${cellStyle} w-2rem flex text-green-900 font-bold`}>{letter}</div>
                        <div className={`${cellStyle} w-2rem flex border-0 border-round-2xl ${isVowel(letter.toLowerCase()) ? "bg-red-100" : "bg-blue-100" }`}>{pythagoreanLetterValues[index]}</div>
                    </div>
                ))}
                <div className='mx-1'>
                    <div className={`${cellStyle} w-5rem flex`}>Vowels</div>
                    <div className={`${cellStyle} w-5rem flex border-round-xl bg-red-200`}>{chaldeanValues.vowels}</div>
                    <div className={`${cellStyle} w-5rem hidden md:flex`}></div>
                    <div className={`${cellStyle} w-5rem flex border-round-xl bg-red-200`}>{pythagoreanValues.vowels}</div>
                </div>
                <div className='mx-1'>
                    <div className={`${cellStyle} w-5rem flex`}>Consonants</div>
                    <div className={`${cellStyle} w-5rem flex border-round-xl bg-blue-200`}>{chaldeanValues.consonants}</div>
                    <div className={`${cellStyle} w-5rem hidden md:flex`}></div>
                    <div className={`${cellStyle} w-5rem flex border-round-xl bg-blue-200`}>{pythagoreanValues.consonants}</div>
                </div>
                <div className='mx-1 justify-content-end'>
                    <div className={`${cellStyle} w-5rem flex`}>Total</div>
                    <div className={`${cellStyle} w-5rem flex border-round-xl bg-green-200`}>{`${chaldeanValues.total} / ${chaldeanValues.actual}`}</div>
                    <div className={`${cellStyle} w-5rem hidden md:flex`}></div>
                    <div className={`${cellStyle} w-5rem flex border-round-xl bg-green-200`}>{`${pythagoreanValues.total} / ${pythagoreanValues.actual}`}</div>
                </div>
            </div>
            <div className='mt-2 flex w-full surface-0 p-2 border-round-md overflow-auto block md:hidden'>
                {/* Display values of each letter of the name */}
                {name.split('').map((letter, index) => (
                    <div key={index} className='block md:hidden'>
                        <div className={`${cellStyle} w-2rem flex border-0 border-round-2xl ${isVowel(letter.toLowerCase()) ? "bg-red-100" : "bg-blue-100" }`}>{chaldeanLetterValues[index]}</div>
                        <div className={`${cellStyle} w-2rem flex text-green-900 font-bold`}>{letter}</div>
                        <div className={`${cellStyle} w-2rem flex border-0 border-round-2xl ${isVowel(letter.toLowerCase()) ? "bg-red-100" : "bg-blue-100" }`}>{pythagoreanLetterValues[index]}</div>
                    </div>
                ))}
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