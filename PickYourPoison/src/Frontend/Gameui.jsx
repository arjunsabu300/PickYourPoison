import React, { useState } from 'react'
import axios from 'axios';

const Gameui=()=>{

    const [gameType,setGameType]=useState('would-you-rather');
    const [category,setCategory]=useState('random');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchQuestions = async()=>{
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/questions', {
                gameType,category
            });

            if(response.status==200){
                setQuestions(response.data.questions);
                console.log("generated successfully");

            }
            else{
                console.error('Failed to fetch questions:', response.data.error);
                setQuestions([]);
            }
            
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
        finally{
            setLoading(false);
        }
    };
    return(
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-200 to-indigo-300 p-4 sm:px-6 md:px-8">
            <h1 className="text-4xl font-extrabold text-indigo-800 mb-10 mt-4 text-center">
            PickYourPoison: Where Choices Twist & Truths Hide
            </h1>

                <p className="text-lg text-indigo-900 font-medium mb-30 text-center">
                    AI-powered icebreaker questions that’ll twist your brain and test your truth radar
                </p>

            <div className="flex flex-col md:flex-row gap-4 mb-30">
                <select value={gameType} onChange={e => setGameType(e.target.value)} className="p-2 rounded-lg">
                    <option value="would-you-rather">Would You Rather</option>
                    <option value="two-truths">Two Truths and a Lie</option>
                </select>
                <select value={category} onChange={e => setCategory(e.target.value)} className="p-2 rounded-lg">
                    <option value="random">Random</option>
                    <option value="food">Food</option>
                    <option value="travel">Travel</option>
                    <option value="funny">Funny</option>
                </select>
                <button onClick={fetchQuestions} className="bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-900">
                    Generate Question
                </button>
            </div>
            <div className="w-full max-w-xl bg-white p-4 rounded-lg shadow-md space-y-3 mt-4">
            {loading ? (
            <p className="text-center">Generating questions...</p>
            ) : (
            questions.map((q, i) => <p key={i} className="text-lg">{q}</p>)
            )}
        </div>
    </div>
    );
};

export default Gameui;