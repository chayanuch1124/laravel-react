import { useEffect, useState } from 'react';
declare global {
    interface Window {
        google: any;
    }
}
const MangaReview = () => {
    const [votes, setVotes] = useState({
        Awesome: 32,
        Funny: 9,
        Love: 56,
        Scared: 4,
        Angry: 11,
        Sad: 6,
    });

    const [votedEmoji, setVotedEmoji] = useState<string | null>(null);

    const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
    const getPercentage = (count: any) => {
        if (totalVotes === 0) return '0%';
        return ((count / totalVotes) * 100).toFixed(1) + '%';
    };

    const handleVote = (type: string) => {
        setVotes((prev: any) => ({ ...prev, [type]: prev[type] + 1 }));
        setVotedEmoji(type);
        setTimeout(() => setVotedEmoji(null), 400); // ลบ class หลัง animation
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://www.gstatic.com/charts/loader.js';
        script.onload = () => {
            if (window.google) {
                window.google.charts.load('current', { packages: ['corechart'] });
                window.google.charts.setOnLoadCallback(drawChart);
            }
        };

        document.body.appendChild(script);
        
    }, []);

    useEffect(() => {
        if (window.google?.visualization?.LineChart) {
            drawChart();
        }
    }, [votes]);

    useEffect(() => {
        let resizeTimer: NodeJS.Timeout;
    
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.google?.visualization?.LineChart) {
                    drawChart();
                }
            }, 150); // หน่วงเวลา 200ms
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimer);
        };
    }, []);

    const drawChart = () => {
        const data = window.google.visualization.arrayToDataTable([
            ['Emoji', 'Votes', { role: 'annotation' }],
            ['👍', votes.Awesome, getPercentage(votes.Awesome)],
            ['🤣', votes.Funny, getPercentage(votes.Funny)],
            ['😍', votes.Love, getPercentage(votes.Love)],
            ['😨', votes.Scared, getPercentage(votes.Scared)],
            ['😡', votes.Angry, getPercentage(votes.Angry)],
            ['😢', votes.Sad, getPercentage(votes.Sad)],
        ]);

        const options = {
            title: '',
            backgroundColor: 'transparent', // ส่วน plot พื้นหลังโปร่งใส
            curveType: 'function',
            legend: 'none',

            annotations: {
                alwaysOutside: true,
                textStyle: {
                    fontSize: 14,
                    color: '#000',
                    auraColor: 'none',
                },
            },
            vAxis: {
                title: '',
                minValue: 0,
                gridlines: { color: 'transparent' },
                textPosition: 'none',
                baselineColor: 'transparent', // ซ่อนเส้นแกนหลักแนวนอน
            },
            hAxis: {
                textStyle: { fontSize: 35 },
                gridlines: { color: 'transparent' },
            },
            chartArea: { top: 30 },
        };

        const chart = new window.google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    };

    return (
        <div className="manga-container">
            {/* ซ้าย: รูป */}
            <div style={{ flex: 1, justifyContent: 'center', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <img
                    src="https://comicthumb-phinf.pstatic.net/20250317_141/pocket_1742203194479afz2t_JPEG/%BD%C3%B8%AE%C1%EE_%C6%F7%BD%BA%C5%CD_%BD%E6%B3%D7%C0%CF_690x1000.jpg"
                    alt="cover"
                    style={{ width: '60%', borderRadius: '10px' }}
                />
                <button
                    style={{
                        marginTop: '15px',
                        padding: '10px 20px',
                        fontSize: '16px',
                        borderRadius: '10px',
                        border: '2px solid #ff4d4f', // ขอบสีแดง
                        backgroundColor: 'transparent', // ไม่มีพื้นหลัง
                        color: '#ff4d4f', // สีตัวอักษรตรงกับขอบ
                        cursor: 'pointer',
                        width: '60%',
                    }}
                    onClick={() => alert('ไปยังตอนแรก!')} // เปลี่ยนเป็นลิงก์จริงถ้ามี
                >
                    📖 Read the first part
                </button>
            </div>

            {/* ขวา: ข้อมูล */}
            <div style={{ flex: 2 }}>
                <h1>Hold Her Tighter So She Wouldn’t Run Away</h1>
                <p>
                    <strong>Genres : </strong>
                    {['Comedy', 'Fantasy', 'Romance'].map((genre, index) => {
                        const borderColors = ['#ff7f50', '#87ceeb', '#da70d6'];
                        return (
                            <span
                                key={genre}
                                className="genre-tag"
                                onClick={() => alert(`คุณเลือกแนว ${genre}`)}
                                style={{
                                    border: `2px solid ${borderColors[index % borderColors.length]}`,
                                }}
                            >
                                {genre}
                            </span>
                        );
                    })}

                    {/* สไตล์สำหรับป้ายแนว */}
                    <style>{`
    .genre-tag {
      display: inline-block;
      border-radius: 20px;
      padding: 4px 10px;
      margin-right: 8px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s, color 0.2s;
    }
    .genre-tag:hover {
      background-color: rgba(0,0,0,0.1);
      color: #333;
    }
                    `}</style>
                </p>

                <p>
                    <strong>Publication : </strong>
                    <span style={{ color: 'green', fontWeight: 'bold', textTransform: 'uppercase' }}>Ongoing</span>
                </p>

                <p>
                    Theo is forced into a political marriage by the Empire. But the moment he sees his wife, Yuelina, he falls in love! Yet, she is
                    destined to be sacrificed for the Empire… Can Theo protect her and spend a lifetime together?
                </p>

                <div
                    id="chart-wrapper"
                    style={{
                        border: '2px solid #ccc',
                        borderRadius: '20px',
                        padding: '25px',
                        background: '#fff',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                >
                    <div className="chart-flex">
                        {/* คอลัมน์: รายการโหวต */}
                        <div style={{ flex: 1 }}>
                            <h4>
                            Vote results  {totalVotes} Votes</h4>
                            <ul style={{ lineHeight: '2em', listStyle: 'none', paddingLeft: 0 }}>
                                {[
                                    { key: 'Awesome', emoji: '👍' },
                                    { key: 'Funny', emoji: '🤣' },
                                    { key: 'Love', emoji: '😍' },
                                    { key: 'Scared', emoji: '😨' },
                                    { key: 'Angry', emoji: '😡' },
                                    { key: 'Sad', emoji: '😢' },
                                ].map(({ key, emoji }) => (
                                    <li key={key}>
                                        <button
                                            onClick={() => handleVote(key)}
                                            className={votedEmoji === key ? 'bounce' : ''}
                                            style={{
                                                fontSize: '24px',
                                                marginRight: '10px',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                            }}
                                            aria-label={`Vote ${key}`}
                                        >
                                            {emoji}
                                        </button>
                                        {key}: {votes[key as keyof typeof votes]}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* คอลัมน์: กราฟ */}
                        <div style={{ flex: 4 }}>
                            <div id="chart_div" style={{ width: '100%', height: '300px' }}></div>
                        </div>
                    </div>
                </div>
                {/* ตอนทั้งหมด */}
<div style={{ width: '100%', marginTop: '40px' }}>
    <h2>📚 Episodes</h2>
    <div
        style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '10px',
            marginTop: '10px',
        }}
    >
        {Array.from({ length: 20 }, (_, i) => (
            <button
                key={i}
                style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    backgroundColor: '#fafafa',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                }}
                onClick={() => alert(`คุณเลือกอ่านตอนที่ ${i + 1}`)}
            >
                ตอนที่ {i + 1}
            </button>
        ))}
    </div>
</div>

            </div>
            
            {/* เพิ่ม style สำหรับ bounce animation */}
            <style>{`
    @keyframes bounce {
        0% { transform: translateY(0); }
        30% { transform: translateY(-10px); }
        50% { transform: translateY(0); }
        100% { transform: translateY(0); }
    }
    .bounce {
        animation: bounce 0.4s ease;
    }

    .manga-container {
        display: flex;
        flex-direction: row;
        gap: 20px;
        padding: 20px;
        font-family: 'Opun', sans-serif;
        align-items: flex-start;
    }

    @media (max-width: 1200px) {
        .manga-container {
            flex-direction: column;
            align-items: center;
        }

        .manga-container > div:first-child {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .manga-container > div:nth-child(2) {
            width: 100%;
            margin-top: 20px;
        }
       
    }
       .chart-flex {
    display: flex;
    gap: 20px;
    flex-direction: row;
}

@media (max-width: 1200px) {
    .chart-flex {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    #chart_div {
        margin-top: 20px;
        width: 100% !important;
        max-width: 500px;
    }
} 
            `}</style>

        </div>
        
    );
};

export default MangaReview;
