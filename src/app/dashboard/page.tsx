"use client";

import { useState, useEffect } from "react";
import { format, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";

type Schedule = {
  id: string;
  target_date: string;
  cell_name: string;
  employee_name: string;
  status_type: string;
  start_time: string | null;
  end_time: string | null;
  memo: string;
};

// Mock data generation
const generateMockData = (): Schedule[] => {
  const today = format(new Date(), "yyyy-MM-dd");
  return [
    { id: "1", target_date: today, cell_name: "1셀", employee_name: "김현조", status_type: "정상출근", start_time: "9시", end_time: "18시", memo: "" },
    { id: "2", target_date: today, cell_name: "2셀", employee_name: "윤원근", status_type: "휴가(전일)", start_time: null, end_time: null, memo: "개인 사정" },
    { id: "3", target_date: today, cell_name: "3셀", employee_name: "신상수", status_type: "외근(종일)", start_time: null, end_time: null, memo: "A사 미팅" },
    { id: "4", target_date: today, cell_name: "1셀", employee_name: "공영경", status_type: "휴가(오전)", start_time: "14시", end_time: "18시", memo: "오전 반차" },
    { id: "5", target_date: today, cell_name: "2셀", employee_name: "오혜인", status_type: "교육", start_time: null, end_time: null, memo: "사내 직무 교육" },
  ];
};

const getBadgeStyle = (status: string) => {
  if (status.includes("휴가")) return "bg-green-100 text-green-700 border-green-200";
  if (status.includes("외근")) return "bg-blue-100 text-blue-700 border-blue-200";
  if (status.includes("교육")) return "bg-purple-100 text-purple-700 border-purple-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
};

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedCell, setSelectedCell] = useState<string>("전체");
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Load from localStorage or use mock
    const localData = localStorage.getItem("mock_schedules");
    let allData: Schedule[] = [];
    if (localData) {
      allData = JSON.parse(localData);
    } else {
      allData = generateMockData();
      localStorage.setItem("mock_schedules", JSON.stringify(allData));
    }
    
    // Filter by selected date
    const dateStr = format(currentDate, "yyyy-MM-dd");
    let filtered = allData.filter(s => s.target_date === dateStr);
    
    // Filter by cell
    if (selectedCell !== "전체") {
      filtered = filtered.filter(s => s.cell_name === selectedCell);
    }
    
    setSchedules(filtered);
  }, [currentDate, selectedCell, isAuthenticated]);

  const handlePrevDay = () => setCurrentDate(prev => subDays(prev, 1));
  const handleNextDay = () => setCurrentDate(prev => addDays(prev, 1));

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "1234") { // Simple password for MVP
      setIsAuthenticated(true);
      setErrorMsg("");
    } else {
      setErrorMsg("비밀번호가 일치하지 않습니다.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="bg-white border rounded-2xl shadow-xl p-8 max-w-sm w-full text-center space-y-6">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">대시보드 접근 권한</h2>
            <p className="text-sm text-gray-500 mt-2">조회를 위해 비밀번호를 입력해주세요.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="비밀번호 (초기값: 1234)"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-medium rounded-lg py-3 hover:bg-blue-700 transition-colors"
            >
              확인
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">근무 현황 대시보드</h1>
        
        {/* Date Controller */}
        <div className="flex items-center gap-3 bg-white border shadow-sm rounded-lg p-1 w-max">
          <button onClick={handlePrevDay} className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-600">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="font-semibold text-gray-800 px-4 min-w-[120px] text-center">
            {format(currentDate, "yyyy-MM-dd")}
          </div>
          <button onClick={handleNextDay} className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-600">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Cell Filter */}
      <div className="flex gap-2 border-b pb-4">
        {["전체", "1셀", "2셀", "3셀"].map(cell => (
          <button
            key={cell}
            onClick={() => setSelectedCell(cell)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCell === cell
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 border hover:bg-gray-50"
            }`}
          >
            {cell}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            if (schedules.length === 0) {
              alert("복사할 일정이 없습니다.");
              return;
            }
            const dateStr = format(currentDate, "yyyy-MM-dd");
            const headerText = `📢 [MyData Work Sync] ${dateStr} 근무 현황\n\n`;
            
            // Group by Cell
            const cells = ["1셀", "2셀", "3셀"];
            const cellTexts = cells.map(cell => {
              const cellSchedules = schedules.filter(s => s.cell_name === cell);
              if (cellSchedules.length === 0) return "";
              
              const items = cellSchedules.map(s => {
                const noTime = ["휴가(전일)", "외근(종일)", "교육"].includes(s.status_type);
                const timeText = noTime ? "" : ` (${s.start_time || ""} ~ ${s.end_time || ""})`;
                const memoText = s.memo ? ` - ${s.memo}` : "";
                return `• ${s.employee_name}: [${s.status_type}]${timeText}${memoText}`;
              }).join("\n");
              
              return `■ ${cell}\n${items}`;
            }).filter(Boolean).join("\n\n");

            const fullText = headerText + cellTexts;

            navigator.clipboard.writeText(fullText)
              .then(() => alert("일정이 클립보드에 복사되었습니다! 카톡방에 붙여넣기(Ctrl+V) 하세요."))
              .catch(err => alert("복사 실패: " + err));
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-all"
        >
          📋 카톡 공유용 텍스트 복사
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap w-24">이름</th>
                <th className="px-6 py-4 whitespace-nowrap w-32">근태 상태</th>
                <th className="px-6 py-4 whitespace-nowrap w-40">근무 시간</th>
                <th className="px-6 py-4 min-w-[200px]">공유 사항</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {schedules.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    해당 날짜에 등록된 일정이 없습니다.
                  </td>
                </tr>
              ) : (
                schedules.map((schedule) => {
                  const noTime = ["휴가(전일)", "외근(종일)", "교육"].includes(schedule.status_type);
                  const timeDisplay = noTime 
                    ? "-" 
                    : `${schedule.start_time || ""} ~ ${schedule.end_time || ""}`;

                  return (
                    <tr key={schedule.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {schedule.employee_name}
                        <span className="ml-2 text-xs text-gray-400 font-normal">{schedule.cell_name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getBadgeStyle(schedule.status_type)}`}>
                          {schedule.status_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-medium">
                        {timeDisplay}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="max-w-md truncate md:whitespace-normal">
                          {schedule.memo || <span className="text-gray-400 italic">없음</span>}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
