"use client";

import { useState } from "react";
import { consultSommelier } from "../lib/mockSommelier";

// Define Types for clarity
type ChartData = {
    sweetness: number;
    aroma: number;
};

type SakeResult = {
    id: string;
    name: string;
    brewery: string;
    image?: string;
    reason: string;
    charts: ChartData;
    drinkStyle: string;
    pairing: string;
};

export default function SommelierInterface() {
    const [input, setInput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [results, setResults] = useState<SakeResult[] | null>(null);

    const handleConsult = async () => {
        if (!input.trim()) return;
        setLoading(true);
        setResults(null);
        try {
            const data = await consultSommelier(input);
            setResults(data as SakeResult[]);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleChipClick = (text: string) => {
        setInput(text);
    };

    return (
        <div className="max-w-4xl mx-auto px-5 py-10 text-center">
            <header className="mb-16">
                <h1 className="text-4xl font-light tracking-[0.2em] text-sake-primary mb-5 border-b border-sake-accent inline-block pb-2">
                    新潟県の日本酒ソムリエ
                </h1>
                <p className="text-sake-text-light text-base tracking-widest">
                    あなたの一献、選びます。
                </p>
            </header>

            <div className="bg-white/80 p-10 rounded shadow-sm border border-[#e5e5e5] mb-10">
                <p className="text-xl mb-5 text-sake-primary">
                    今の気分や、合わせたいお料理はいかがですか？
                </p>

                <div className="flex justify-center gap-3 mb-8 flex-wrap">
                    {[
                        { label: "🌙 癒やされたい", text: "仕事で疲れたので癒やされたい" },
                        { label: "🎉 お祝い", text: "娘の結婚式でお祝いしたい" },
                        { label: "🌿 リフレッシュ", text: "気分をリフレッシュしたい" },
                        { label: "🍢 料理と合わせる", text: "焼き鳥（塩）に合わせて" },
                        { label: "🍰 スイーツ", text: "スイーツと合わせたい" },
                        { label: "🐟 海産物", text: "佐渡の海産物" },
                    ].map((chip) => (
                        <button
                            key={chip.label}
                            className="bg-white border border-[#e5e5e5] px-4 py-2 rounded-full text-sm text-sake-text-light hover:border-sake-accent hover:text-sake-accent transition-colors"
                            onClick={() => handleChipClick(chip.text)}
                        >
                            {chip.label}
                        </button>
                    ))}
                </div>

                <textarea
                    className="w-full p-4 text-base border border-[#e5e5e5] bg-[#fafafa] resize-y min-h-[100px] mb-5 focus:outline-none focus:border-sake-accent focus:ring-2 focus:ring-sake-accent/20 transition-all rounded-sm"
                    placeholder="例：静かな夜に一人でゆっくり飲めるお酒をお願いします..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={3}
                />

                <button
                    className="bg-sake-primary text-white border-0 py-3 px-10 text-lg tracking-widest cursor-pointer hover:bg-sake-primary-light disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                    onClick={handleConsult}
                    disabled={loading || !input.trim()}
                >
                    {loading ? "選定中..." : "ソムリエに相談する"}
                </button>
            </div>

            {loading && (
                <div className="text-xl text-sake-accent animate-pulse">
                    <p>🍶 あなたのために、蔵元の在庫を確認しています...</p>
                </div>
            )}

            {results && (
                <div className="flex flex-col gap-10 items-center">
                    {results.map((sake) => (
                        <div key={sake.id} className="bg-white border border-[#e5e5e5] p-10 text-left w-full max-w-3xl shadow-sm relative overflow-hidden flex flex-col fade-in">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-sake-accent z-10"></div>

                            <div className="mb-5 border-b border-[#eee] pb-5">
                                <h2 className="text-3xl text-sake-primary mb-2 font-serif">{sake.name}</h2>
                                <p className="text-sake-text-light text-base">{sake.brewery}</p>
                            </div>

                            <span className="text-sm text-sake-accent font-bold mb-2 block">【ソムリエの選択理由】</span>
                            <p className="mb-8 leading-loose text-justify text-base">
                                {sake.reason}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-[#fafafa] p-5 mb-5">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span>甘辛度</span>
                                        <span className="text-sake-accent tracking-widest">
                                            {"★".repeat(sake.charts.sweetness)}{"☆".repeat(5 - sake.charts.sweetness)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>華やか</span>
                                        <span className="text-sake-accent tracking-widest">
                                            {"★".repeat(sake.charts.aroma)}{"☆".repeat(5 - sake.charts.aroma)}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between">
                                        <span>飲み方</span>
                                        <span>{sake.drinkStyle}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-[#eee] pt-5 italic text-sake-primary-light">
                                <strong>【おすすめの組み合わせ】</strong> {sake.pairing}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
