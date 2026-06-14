import { useState, useEffect, useMemo } from "react";
import { Search, Plus, ArrowRight, X, Flame } from "lucide-react";
import { searchFoods, Food } from "../services/foodApi";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type AddedFood = {
  id: string;
  name: string;
  amount: number;
  unit: string;
  calculatedKcal: number;
  carbs: number;
  protein: number;
  fat: number;
};

export default function AddMeal() {
  const [activeTab, setActiveTab] = useState<"search" | "custom">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Row-level input states for grams
  const [inputAmounts, setInputAmounts] = useState<Record<number, string>>({});

  // Custom Food Form State
  const [customName, setCustomName] = useState("");
  const [customKcal, setCustomKcal] = useState<number | "">("");

  // Added Foods List
  const [addedFoods, setAddedFoods] = useState<AddedFood[]>([]);

  // Derived state
  const totalCalories = addedFoods.reduce((acc, curr) => acc + curr.calculatedKcal, 0);
  const totalCarbs = addedFoods.reduce((acc, curr) => acc + curr.carbs, 0);
  const totalProtein = addedFoods.reduce((acc, curr) => acc + curr.protein, 0);
  const totalFat = addedFoods.reduce((acc, curr) => acc + curr.fat, 0);

  const macroData = useMemo(() => {
    return [
      { name: "탄수화물", value: totalCarbs, color: "#D4FF00" }, // Neon
      { name: "단백질", value: totalProtein, color: "#3B82F6" }, // Blue
      { name: "지방", value: totalFat, color: "#EF4444" }, // Red
    ].filter(m => m.value > 0);
  }, [totalCarbs, totalProtein, totalFat]);
  
  // Debounced Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
        const results = await searchFoods(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Handlers
  const handleAmountChange = (foodId: number, val: string) => {
    setInputAmounts(prev => ({ ...prev, [foodId]: val }));
  };

  const handleAddFood = (food: Food) => {
    const amountStr = inputAmounts[food.id];
    if (!amountStr) return;
    const amount = Number(amountStr);
    if (amount <= 0) return;

    // 백엔드는 100g 기준
    const ratio = amount / 100;
    
    setAddedFoods((prev) => [
      ...prev,
      {
        id: Date.now().toString() + Math.random().toString(),
        name: food.foodName,
        amount,
        unit: "g",
        calculatedKcal: Math.round(food.calories * ratio * 10) / 10,
        carbs: Math.round(food.carbohydrates * ratio * 10) / 10,
        protein: Math.round(food.protein * ratio * 10) / 10,
        fat: Math.round(food.fat * ratio * 10) / 10,
      }
    ]);
    
    // Reset input for this row
    setInputAmounts(prev => ({ ...prev, [food.id]: "" }));
  };

  const handleAddCustomFood = () => {
    if (!customName.trim() || !customKcal) return;

    setAddedFoods((prev) => [
      ...prev,
      {
        id: Date.now().toString() + Math.random().toString(),
        name: customName,
        amount: 1,
        unit: "회",
        calculatedKcal: Number(customKcal),
        carbs: 0,
        protein: 0,
        fat: 0,
      }
    ]);
    
    setCustomName("");
    setCustomKcal("");
  };

  const handleRemoveFood = (id: string) => {
    setAddedFoods((prev) => prev.filter(f => f.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm("담은 식단을 모두 초기화하시겠습니까?")) {
      setAddedFoods([]);
      setInputAmounts({});
    }
  };

  return (
    <div className="flex-1 bg-black text-white pb-24 font-sans selection:bg-neon-500 selection:text-black">
      <main className="max-w-6xl mx-auto px-5 pt-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Search & List */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-black tracking-tighter">식단 추가</h1>
              {/* Segmented Control for Tabs */}
              <div className="flex bg-[#111111] p-1.5 rounded-xl border border-zinc-800/50 w-64">
                <button 
                  onClick={() => setActiveTab("search")}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                    activeTab === "search" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-white"
                  }`}
                >
                  검색
                </button>
                <button 
                  onClick={() => setActiveTab("custom")}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                    activeTab === "custom" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-white"
                  }`}
                >
                  직접 입력
                </button>
              </div>
            </div>

            {/* Tab Content: Search */}
            {activeTab === "search" && (
              <div className="animate-in fade-in duration-500 flex flex-col gap-5">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="어떤 음식을 드셨나요? (예: 사과, 현미밥)" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#111111] border border-zinc-800/50 rounded-2xl py-4 pl-5 pr-14 text-lg font-bold outline-none focus:border-neon-500 transition-all text-white placeholder:text-zinc-600 shadow-inner"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-neon-500 rounded-xl flex items-center justify-center">
                    <Search className="w-5 h-5 text-black" />
                  </div>
                </div>

                <div className="bg-[#111111] border border-zinc-800/50 rounded-2xl overflow-hidden">
                  <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                    {isSearching ? (
                      <div className="py-20 text-center text-zinc-500 font-bold text-lg animate-pulse">
                        데이터를 찾는 중입니다...
                      </div>
                    ) : searchResults.length === 0 && searchQuery.trim() !== "" ? (
                      <div className="py-20 text-center text-zinc-600 font-bold text-lg">
                        검색 결과가 없습니다.
                      </div>
                    ) : searchResults.length > 0 ? (
                      <table className="w-full text-left text-sm text-zinc-300">
                        <thead className="text-xs bg-zinc-900/50 text-zinc-500 sticky top-0 z-10 backdrop-blur-md border-b border-zinc-800/50">
                          <tr>
                            <th className="px-6 py-4 font-bold">음식명</th>
                            <th className="px-4 py-4 font-bold text-center">칼로리 (100g당)</th>
                            <th className="px-4 py-4 font-bold text-center">탄/단/지 (단위:g)</th>
                            <th className="px-6 py-4 font-bold text-right">추가하기</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                          {searchResults.map(food => (
                            <tr key={food.id} className="hover:bg-zinc-800/30 transition-colors group">
                              <td className="px-6 py-4">
                                <p className="font-bold text-base text-white">{food.foodName}</p>
                              </td>
                              <td className="px-4 py-4 text-center">
                                <span className="font-bold text-lg text-neon-400">{food.calories}</span> <span className="text-sm text-zinc-400">kcal</span>
                              </td>
                              <td className="px-4 py-4 text-center text-sm font-medium text-white tracking-wide">
                                {food.carbohydrates} <span className="text-zinc-600 font-light mx-0.5">/</span> {food.protein} <span className="text-zinc-600 font-light mx-0.5">/</span> {food.fat}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <div className="relative">
                                    <input 
                                      type="number" 
                                      placeholder="0"
                                      value={inputAmounts[food.id] || ""}
                                      onChange={(e) => handleAmountChange(food.id, e.target.value)}
                                      onKeyDown={(e) => {
                                        if(e.key === 'Enter') handleAddFood(food);
                                      }}
                                      className="w-20 bg-black border border-zinc-700 focus:border-neon-500 rounded-lg py-2 pl-3 pr-6 text-white text-right outline-none transition-all font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-bold pointer-events-none">g</span>
                                  </div>
                                  <button 
                                    onClick={() => handleAddFood(food)}
                                    disabled={!inputAmounts[food.id]}
                                    className="w-10 h-10 bg-zinc-800 hover:bg-neon-500 hover:text-black disabled:opacity-50 disabled:hover:bg-zinc-800 disabled:hover:text-white rounded-lg flex items-center justify-center transition-all text-white"
                                  >
                                    <Plus className="w-5 h-5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="py-20 flex flex-col items-center justify-center opacity-30">
                        <Search className="w-16 h-16 mb-4" />
                        <p className="font-bold text-xl">음식을 검색해보세요</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content: Custom Input */}
            {activeTab === "custom" && (
              <div className="bg-[#111111] border border-zinc-800/50 rounded-2xl p-8 animate-in fade-in duration-500">
                <h2 className="text-2xl font-black mb-8 tracking-tighter text-white">직접 입력하기</h2>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-zinc-500 font-bold mb-2 uppercase tracking-widest text-xs">음식명</label>
                    <input 
                      type="text" 
                      placeholder="예: 집밥 정식" 
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-xl py-4 px-5 text-base font-bold outline-none focus:border-neon-500 transition-all text-white placeholder:text-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-500 font-bold mb-2 uppercase tracking-widest text-xs">총 칼로리 (kcal)</label>
                    <input 
                      type="number" 
                      placeholder="예: 600" 
                      value={customKcal}
                      onChange={(e) => setCustomKcal(e.target.value ? Number(e.target.value) : "")}
                      className="w-full bg-black border border-zinc-800 rounded-xl py-4 px-5 text-base font-bold outline-none focus:border-neon-500 transition-all text-white placeholder:text-zinc-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
                <button 
                  onClick={handleAddCustomFood}
                  disabled={!customName.trim() || !customKcal}
                  className="w-full bg-neon-500 hover:bg-[#bce600] disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-black text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,255,0,0.1)] disabled:shadow-none"
                >
                  식단에 추가하기 <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Summary Dashboard */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="sticky top-24 flex flex-col gap-6">
              
              {/* Daily Summary Widget */}
              <div className="bg-[#111111] border border-zinc-800/50 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-neon-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                
                <h2 className="text-xl font-black tracking-tight mb-6 flex items-center gap-2">
                  <Flame className="text-neon-500 w-5 h-5" />
                  오늘의 섭취량
                </h2>
                
                <div className="flex items-end gap-2 mb-8">
                  <span className="text-5xl font-black tracking-tighter text-neon-400 leading-none">
                    {Math.round(totalCalories)}
                  </span>
                  <span className="text-lg font-bold text-zinc-500 pb-1">kcal</span>
                </div>

                {/* Macro Nutrients Donut Chart */}
                <div className="h-40 w-full mb-6 relative">
                  {macroData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={macroData}
                          innerRadius={50}
                          outerRadius={65}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {macroData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => [`${Math.round(value)}g`, ""]}
                          contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px', fontWeight: 'bold' }}
                          itemStyle={{ color: '#fff' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center rounded-full border-8 border-zinc-800/30">
                      <span className="text-sm font-bold text-zinc-600">데이터 없음</span>
                    </div>
                  )}
                  {/* Center Label */}
                  {macroData.length > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">비율</span>
                    </div>
                  )}
                </div>

                {/* Macro Legend */}
                <div className="flex justify-between items-center bg-black p-5 rounded-2xl border border-zinc-800">
                  <div className="flex-1 flex flex-col items-center">
                    <span className="text-sm font-bold text-white mb-1.5">탄수화물</span>
                    <span className="text-base font-black text-[#D4FF00]">{Math.round(totalCarbs)}g</span>
                  </div>
                  <div className="w-px h-10 bg-zinc-800 shrink-0"></div>
                  <div className="flex-1 flex flex-col items-center">
                    <span className="text-sm font-bold text-white mb-1.5">단백질</span>
                    <span className="text-base font-black text-blue-500">{Math.round(totalProtein)}g</span>
                  </div>
                  <div className="w-px h-10 bg-zinc-800 shrink-0"></div>
                  <div className="flex-1 flex flex-col items-center">
                    <span className="text-sm font-bold text-white mb-1.5">지방</span>
                    <span className="text-base font-black text-red-500">{Math.round(totalFat)}g</span>
                  </div>
                </div>
              </div>

              {/* Added Foods Tray */}
              <div className="bg-[#111111] border border-zinc-800/50 rounded-3xl p-6 shadow-xl flex-1 max-h-[280px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-black tracking-tight text-white">담은 식단 <span className="text-neon-400 ml-1">{addedFoods.length}</span></h2>
                  {addedFoods.length > 0 && (
                    <button 
                      onClick={handleClearAll}
                      className="text-xs font-bold text-zinc-500 hover:text-red-500 transition-colors"
                    >
                      전체 초기화
                    </button>
                  )}
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                  {addedFoods.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-sm font-bold text-zinc-600 pb-4">
                      아직 담은 음식이 없습니다.
                    </div>
                  ) : (
                    addedFoods.map((food) => (
                      <div key={food.id} className="bg-black rounded-xl p-4 flex items-center justify-between border border-zinc-800 group relative">
                        <div className="pr-12">
                          <h3 className="text-sm font-bold text-white mb-0.5 truncate">{food.name}</h3>
                          <div className="flex items-center gap-2 text-xs font-medium">
                            <span className="text-neon-400">{food.calculatedKcal}kcal</span>
                            <span className="text-zinc-600">•</span>
                            <span className="text-zinc-500">{food.amount}{food.unit}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleRemoveFood(food.id)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-zinc-800 hover:bg-red-500 text-zinc-400 hover:text-white rounded-lg flex items-center justify-center transition-all opacity-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
