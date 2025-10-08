import { useEffect, useRef } from 'react';
import { Spotlight } from '@/components/ui/spotlight-new';
import BlurText from '@/components/BlurText.jsx';

// Reusable BentoItem component
type BentoItemProps = {
    className?: string;
    children: React.ReactNode;
};

const BentoItem = ({ className = "", children }: BentoItemProps) => {
    const itemRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const item = itemRef.current;
        if (!item) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            item.style.setProperty('--mouse-x', `${x}px`);
            item.style.setProperty('--mouse-y', `${y}px`);
        };

        item.addEventListener('mousemove', handleMouseMove);

        return () => {
            item.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div ref={itemRef} className={`bento-item ${className}`}>
            {children}
        </div>
    );
};

// Main Component
export const CyberneticBentoGrid = () => {
    return (
        <div className="main-container relative overflow-hidden">
            <Spotlight />
            <div className="w-full max-w-6xl z-10 relative">
                <BlurText
                    text="რა შეუძლია ბიტკარს?"
                    className="text-4xl sm:text-5xl font-bold text-white text-center mb-8"
                    threshold={0.3}
                    animateBy="words"
                    direction="top"
                    delay={120}
                />
                <div className="bento-grid">
                    <BentoItem className="lg:col-span-2 lg:row-span-2 flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white">აღმოაჩინე პრობლემა მანამდე, სანამ გავრცელდება</h2>
                            <p className="mt-2 text-gray-400">Beetkar აფიქსირებს უჩვეულო სითბოს ან ბზუილის ნიმუშებს სკაში — იმ ნიშნებს, რომლებიც ჩვეულებრივ ჩნდება რამდენიმე დღით ადრე, სანამ ტკიპები ან დაავადებები თვალით გამოჩნდება.
                            წინასწარ გაიგებ, რომ რაღაც არ არის წესრიგში.</p>
                        </div>
                        <div className="mt-4 h-40 lg:h-48 bg-neutral-800 rounded-lg overflow-hidden">
                            <img 
                                src="/chart.png" 
                                alt="Chart Preview" 
                                className="w-full h-40% object-cover rounded-lg"
                            />
                        </div>
                    </BentoItem>
                    <BentoItem>
                        <h2 className="text-xl font-bold text-white">ნახე, რას გრძნობენ შენი ფუტკრები</h2>
                        <p className="mt-2 text-gray-400 text-sm">ტემპერატურისა და ტენიანობის სენსორები აჩვენებს, ინარჩუნებს თუ არა ოჯახი საკმარის სითბოს და ვენტილაციას ბარტყისთვის.
                        სტაბილური მონაცემები ნიშნავს მშვიდ და ჯანსაღ ფუტკრებს — უეცარი ცვლილება კი სტრესს.</p>
                    </BentoItem>
                    <BentoItem>
                        <h2 className="text-xl font-bold text-white">დაკვირდი აქტივობასა და ქცევას</h2>
                        <p className="mt-2 text-gray-400 text-sm">მოწყობილობა უსმენს და გრძნობს სკის მოძრაობას. მოუსვენარი ან ხმაურიანი სკა შეიძლება მიუთითებდეს შიმშილზე, აგრესიაზე ან დედა ფუტკრის დაკარგვაზე.
                        Beetkar სწავლობს შენი სკის ნორმალურ რიტმს და გაფრთხილებს, როცა რაღაც იცვლება.</p>
                    </BentoItem>
                    <BentoItem className="lg:row-span-2">
                        <h2 className="text-xl font-bold text-white">შეამოწმე სკები ნებისმიერი ადგილიდან</h2>
                        <p className="mt-2 text-gray-400 text-sm">შენი სკა შეიძლება იყოს ეზოში ან მთაში — Beetkar მონაცემებს აგზავნის LoRa-თი ან მობილური ქსელით.
                        გახსენი დაფა და ერთ წამში ნახე ყველა სკის მდგომარეობა.</p>
                    </BentoItem>
                    <BentoItem className="lg:col-span-2">
                        <h2 className="text-xl font-bold text-white">დაიზოგე დრო და გადაარჩინე შენი ფუტკრები</h2>
                        <p className="mt-2 text-gray-400 text-sm">აღარ არის საჭირო სკების გახსნა ყოველ დღე და ფუტკრების შეწუხება.
Beetkar გაძლევს ზუსტ მონაცემებს და გაფრთხილებებს, როცა საჭიროა რეაგირება.
ნაკლები შფოთვა, ნაკლები დანაკარგი, მეტი თაფლი.</p>
                    </BentoItem>
                    <BentoItem>
                        <h2 className="text-xl font-bold text-white">მუშაობს ნებისმიერ სკასთან</h2>
                        <p className="mt-2 text-gray-400 text-sm">მოდული მარტივად თავსდება ორ ჩარჩოს შორის. არ სჭირდება ინსტრუმენტები, გადაკეთება ან რთული დაყენება.
                        ერთხელ დამუხტე, მოათავსე სკაში და Beetkar თვითონ იმუშავებს ჩუმად, შეუმჩნევლად.</p>
                    </BentoItem>
                </div>
            </div>
        </div>
    );
};
