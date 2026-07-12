"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Hardcoded Data
const CELLS = ["1셀", "2셀", "3셀"];
const EMPLOYEES: Record<string, string[]> = {
  "1셀": ["공영경", "김현조", "김형우", "박영은", "안안나", "오미송", "이주영", "정유태"],
  "2셀": ["강재우", "김동현", "김윤진", "박연우", "박장배", "양수승", "엄세원", "오혜인", "윤원근", "이은솔", "지현우", "최영문", "홍윤기"],
  "3셀": ["김나연", "김성환", "문여경", "박경민", "박세민", "박지현", "신상수", "윤하영"],
};

const STATUS_TYPES = [
  "정상출근",
  "휴가(전일)",
  "휴가(오전)",
  "휴가(오후)",
  "외근(종일)",
  "외근(반일)",
  "교육",
];

const START_TIMES = [
  "7시", "8시", "8시30분", "9시", "9시30분", "10시", "11시", "12시"
];

const END_TIMES = [
  "14시", "15시", "16시", "17시", "17시30분", "18시", "18시30분", "19시"
];

export default function RegisterPage() {
  const router = useRouter();
  
  // States
  const [date, setDate] = useState("");
  const [cell, setCell] = useState("1셀");
  const [employee, setEmployee] = useState(EMPLOYEES["1셀"][0]);
  const [status, setStatus] = useState("정상출근");
  const [startTime, setStartTime] = useState("9시");
  const [endTime, setEndTime] = useState("18시");
  const [memo, setMemo] = useState("");

  // Initialize date in client side to avoid SSR mismatch
  useEffect(() => {
    const today = new Date();
    setDate(today.toISOString().split("T")[0]);
  }, []);

  const handleCellChange = (newCell: string) => {
    setCell(newCell);
    setEmployee(EMPLOYEES[newCell][0]);
  };

  // Visibility logic for time selection
  const showTimeSelection = !["휴가(전일)", "외근(종일)", "교육"].includes(status);

  // Load previous entry from localStorage
  const handleLoadPrevious = () => {
    const localData = localStorage.getItem("mock_schedules");
    if (!localData) {
      alert("이전 입력 정보가 존재하지 않습니다.");
      return;
    }
    const allData = JSON.parse(localData);
    // Find the latest record matching current selected employee
    const prevRecord = [...allData]
      .reverse()
      .find((s: any) => s.employee_name === employee);

    if (prevRecord) {
      setCell(prevRecord.cell_name);
      setStatus(prevRecord.status_type);
      if (prevRecord.start_time) setStartTime(prevRecord.start_time);
      if (prevRecord.end_time) setEndTime(prevRecord.end_time);
      setMemo(prevRecord.memo || "");
      alert(`${employee}님의 직전 근무 정보를 불러왔습니다.`);
    } else {
      alert(`${employee}님의 이전 등록 내역이 없습니다.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord = {
      id: crypto.randomUUID(),
      target_date: date,
      cell_name: cell,
      employee_name: employee,
      status_type: status,
      start_time: showTimeSelection ? startTime : null,
      end_time: showTimeSelection ? endTime : null,
      memo: memo,
      created_at: new Date().toISOString(),
    };
    
    const existing = JSON.parse(localStorage.getItem("mock_schedules") || "[]");
    localStorage.setItem("mock_schedules", JSON.stringify([...existing, newRecord]));
    
    alert("등록되었습니다!");
    setMemo("");
  };

  return (
    <div className="max-w-[600px] mx-auto py-8 px-4 text-slate-900">
      {/* Header Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">근무 일정 등록</h1>
        <p className="text-slate-600 mt-2 text-sm">마이데이터유닛의 일일 근무 현황을 간편하게 등록하세요.</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleLoadPrevious}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-600 text-blue-600 text-xs font-semibold hover:bg-blue-50 transition-all active:scale-95 shadow-sm"
          >
            🔄 이전 입력 정보 불러오기
          </button>
        </div>
      </div>

      {/* Registration Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-xl flex flex-col gap-6">
        
        {/* Section 1: Basic Information */}
        <section className="space-y-4">
          <div className="flex items-center pb-2 border-b border-gray-200">
            <span className="text-lg font-bold text-gray-800">1. 기본 정보</span>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">근무 예정일</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">소속</label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-lg">
                {CELLS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleCellChange(c)}
                    className={`py-2 text-sm font-medium rounded-md transition-all ${
                      cell === c
                        ? "bg-white text-blue-600 shadow-sm border border-gray-200/50"
                        : "text-gray-600 hover:bg-white/50"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">이름</label>
              <select
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                {EMPLOYEES[cell].map((emp) => (
                  <option key={emp} value={emp}>{emp}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Section 2: Attendance Status */}
        <section className="space-y-4">
          <div className="flex items-center pb-2 border-b border-gray-200">
            <span className="text-lg font-bold text-gray-800">2. 근태 상태</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {STATUS_TYPES.map((type) => {
              const isSelected = status === type;
              return (
                <button
                  type="button"
                  key={type}
                  onClick={() => setStatus(type)}
                  className={`px-3 py-2 rounded-full text-xs font-semibold border transition-all ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-md transform scale-105"
                      : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 3: Work Hours */}
        {showTimeSelection && (
          <section className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <span className="text-lg font-bold text-gray-800">3. 근무 시간</span>
              <button
                type="button"
                onClick={() => {
                  setStartTime("9시");
                  setEndTime("18시");
                }}
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                기본 시간 채우기 (09:00 ~ 18:00)
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">시작 시간</label>
                <div className="grid grid-cols-4 gap-2">
                  {START_TIMES.map((time) => {
                    const isSelected = startTime === time;
                    return (
                      <button
                        type="button"
                        key={time}
                        onClick={() => setStartTime(time)}
                        className={`h-10 rounded-lg text-xs font-medium border transition-all ${
                          isSelected
                            ? "border-2 border-blue-600 bg-blue-50 text-blue-700 font-bold"
                            : "border-gray-300 hover:border-blue-400 text-gray-700 bg-white"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">종료 시간</label>
                <div className="grid grid-cols-4 gap-2">
                  {END_TIMES.map((time) => {
                    const isSelected = endTime === time;
                    return (
                      <button
                        type="button"
                        key={time}
                        onClick={() => setEndTime(time)}
                        className={`h-10 rounded-lg text-xs font-medium border transition-all ${
                          isSelected
                            ? "border-2 border-blue-600 bg-blue-50 text-blue-700 font-bold"
                            : "border-gray-300 hover:border-blue-400 text-gray-700 bg-white"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Section 4: Shared Notes */}
        <section className="space-y-4">
          <div className="flex items-center pb-2 border-b border-gray-200">
            <span className="text-lg font-bold text-gray-800">4. 공유 사항</span>
          </div>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
            placeholder="근무일정 중 외근, 외부 미팅 등 특이 사항 등록 (일상적인 회의 제외)"
            rows={4}
          />
        </section>

        {/* Action Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3.5 rounded-xl text-base font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg hover:shadow-xl"
        >
          일정 등록 완료
        </button>
      </form>
    </div>
  );
}
