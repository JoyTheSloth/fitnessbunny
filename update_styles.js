const fs = require('fs');
let c = fs.readFileSync('src/screens/DiaryScreen.tsx', 'utf8');

c = c.replace(/rounded-\[1\.5rem\] p-5 shadow-\[0_2px_10px_rgba\(0,0,0,0\.03\)\]/g, 'rounded-[2.5rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-white/80 hover:shadow-[0_12px_40px_rgba(20,69,0,0.06)] hover:-translate-y-1 transition-all duration-300');
c = c.replace(/rounded-\[1\.2rem\] p-4 shadow-\[0_2px_10px_rgba\(0,0,0,0\.03\)\]/g, 'rounded-[2.5rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-white/80 hover:shadow-[0_12px_40px_rgba(20,69,0,0.06)] hover:-translate-y-1 transition-all duration-300');
c = c.replace(/rounded-2xl p-4 flex items-center justify-between shadow-md/g, 'rounded-[2rem] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-white/30 hover:shadow-[0_12px_40px_rgba(20,69,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-between');

const newWater = `{/* Water Block */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-white/80 hover:shadow-[0_12px_40px_rgba(20,69,0,0.06)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6 px-1">
               <h3 className="text-lg font-extrabold text-[#3a4746]">Water</h3>
               <span className="text-[#309af0] font-extrabold bg-[#e4effb] px-3 py-1 rounded-full text-sm">237 ml</span>
            </div>
            <div className="flex items-end justify-between px-1">
               {/* Filled Glass */}
               <div className="relative w-[13%] aspect-[1/1.5] bg-white border-[3px] border-[#e4effb] border-t-0 rounded-b-[1.2rem] overflow-hidden flex flex-col justify-end shadow-sm hover:-translate-y-1 transition-transform cursor-pointer">
                  <div className="bg-gradient-to-t from-[#5bc0f8] to-[#309af0] w-full h-[75%] relative">
                     <div className="absolute top-1 right-1 w-1.5 h-4 bg-white/40 rounded-full rotate-12"></div>
                  </div>
               </div>
               {/* Add Glass */}
               <div className="relative w-[13%] aspect-[1/1.5] bg-white border-[3px] border-[#e2e8e9] border-t-0 rounded-b-[1.2rem] overflow-hidden flex items-center justify-center cursor-pointer hover:bg-[#f4f9ea] hover:border-[#8de15c]/50 hover:-translate-y-1 transition-all shadow-sm group">
                   <div className="bg-[#8de15c] rounded-full text-white w-6 h-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Plus className="w-4 h-4" strokeWidth={4} />
                   </div>
               </div>
               {/* Empty Glasses */}
               {[...Array(4)].map((_, i) => (
                 <div className="relative w-[13%] aspect-[1/1.5] bg-[#f8fafb] border-[3px] border-[#f2f4f5] border-t-0 rounded-b-[1.2rem] overflow-hidden shadow-inner"></div>
               ))}
            </div>
        </div>

      `;
c = c.replace(/\{\/\* Water Block \*\/\}.*?(?=<\/main>)/s, newWater);

fs.writeFileSync('src/screens/DiaryScreen.tsx', c);
