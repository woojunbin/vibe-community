import Link from 'next/link';
import { ArrowRight, Blocks, Users, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-semibold text-gray-900">Vibe Community</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              로그인
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              시작하기
            </Link>
          </div>
        </div>
      </header>

      {/* 히어로 */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          함께 만들고<br />
          <span className="text-blue-600">서로 연결하는</span> 앱 빌더
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
          나만의 페이지를 디자인하고, 다른 사람의 페이지와 자유롭게 연결하세요.
          연결이 모여 하나의 앱이 됩니다.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors text-lg"
        >
          무료로 시작하기 <ArrowRight size={20} />
        </Link>
      </section>

      {/* 특징 */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Blocks size={24} />}
            title="블록으로 디자인"
            description="드래그 앤 드롭으로 버튼, 텍스트, 이미지를 배치하세요. 레벨업하면 더 많은 블록을 사용할 수 있습니다."
          />
          <FeatureCard
            icon={<Users size={24} />}
            title="커뮤니티 연결"
            description="내 로그인 화면에서 다른 사람의 메인 화면으로. 페이지를 연결해 함께 앱을 만드세요."
          />
          <FeatureCard
            icon={<Zap size={24} />}
            title="레벨업 시스템"
            description="페이지를 만들고 공유할수록 경험치를 얻고, 새로운 컴포넌트를 잠금해제하세요."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-2xl border border-gray-200 bg-white">
      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}
