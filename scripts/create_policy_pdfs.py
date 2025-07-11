#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
자유와혁신 정책 자료 PDF 생성 스크립트
"""

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

def create_pdf_documents():
    # 문서 저장 폴더
    docs_folder = "../resources/documents"
    if not os.path.exists(docs_folder):
        os.makedirs(docs_folder)
    
    # 한글 폰트 설정 (Windows 기본 폰트)
    try:
        pdfmetrics.registerFont(TTFont('Malgun', 'c:/Windows/Fonts/malgun.ttf'))
        font_name = 'Malgun'
    except:
        font_name = 'Helvetica'  # 폴백 폰트
    
    # 스타일 설정
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Title'],
        fontName=font_name,
        fontSize=24,
        spaceAfter=30,
        textColor=colors.HexColor('#A50034')
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading1'],
        fontName=font_name,
        fontSize=16,
        spaceAfter=12,
        textColor=colors.HexColor('#A50034')
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontName=font_name,
        fontSize=12,
        spaceAfter=12
    )
    
    # 1. 7대 핵심정책 백서
    create_core_policy_document(docs_folder, title_style, heading_style, normal_style)
    
    # 2. 경제정책 문서들
    create_economy_documents(docs_folder, title_style, heading_style, normal_style)
    
    # 3. 교육정책 문서들
    create_education_documents(docs_folder, title_style, heading_style, normal_style)
    
    # 4. 안보정책 문서들
    create_security_documents(docs_folder, title_style, heading_style, normal_style)
    
    print("정책 자료 PDF 파일들이 성공적으로 생성되었습니다!")

def create_core_policy_document(docs_folder, title_style, heading_style, normal_style):
    """7대 핵심정책 백서 생성"""
    doc = SimpleDocTemplate(
        f"{docs_folder}/자유와혁신_7대핵심정책백서.pdf",
        pagesize=A4,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=18
    )
    
    story = []
    
    # 제목
    story.append(Paragraph("자유와혁신 7대 핵심정책 백서", title_style))
    story.append(Spacer(1, 20))
    
    # 발행 정보
    story.append(Paragraph("발행일: 2024년 1월 15일", normal_style))
    story.append(Paragraph("발행처: 자유와혁신 정책위원회", normal_style))
    story.append(Spacer(1, 30))
    
    # 목차
    story.append(Paragraph("목차", heading_style))
    toc_data = [
        ["1. 경제성장과 일자리 창출", "3"],
        ["2. 교육혁신과 인재양성", "15"],
        ["3. 사회안전망 강화", "28"],
        ["4. 국가안보와 외교정책", "42"],
        ["5. 디지털 혁신과 과학기술", "56"],
        ["6. 환경보호와 지속가능발전", "71"],
        ["7. 지방분권과 균형발전", "85"]
    ]
    
    toc_table = Table(toc_data, colWidths=[4*inch, 1*inch])
    toc_table.setStyle(TableStyle([
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,0), (-1,-1), 12),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    
    story.append(toc_table)
    story.append(PageBreak())
    
    # 각 정책 내용
    policies = [
        {
            "title": "1. 경제성장과 일자리 창출",
            "content": """
            ▪ 창업기업 생태계 구축을 통한 신산업 육성
            ▪ 중소기업 지원 확대 및 상생협력 모델 구축
            ▪ 청년 일자리 창출을 위한 맞춤형 정책 추진
            ▪ 4차 산업혁명 대응 인력 양성 및 재교육 시스템 구축
            
            주요 추진과제:
            - 창업지원센터 전국 확대 설치
            - 중소기업 R&D 지원 예산 50% 증액
            - 청년창업 지원금 확대 및 멘토링 프로그램 운영
            - 디지털 전환 지원을 위한 스마트팩토리 보급 확산
            """
        },
        {
            "title": "2. 교육혁신과 인재양성",
            "content": """
            ▪ 개별 맞춤형 교육시스템 구축
            ▪ 창의성과 문제해결능력 중심의 교육과정 개편
            ▪ 평생학습 체계 구축 및 직업교육 강화
            ▪ 교원의 전문성 향상 및 교육환경 개선
            
            주요 추진과제:
            - AI 기반 개별학습 플랫폼 도입
            - 프로젝트 기반 학습(PBL) 교육과정 확대
            - 성인재교육 프로그램 전국 네트워크 구축
            - 교사 연수 프로그램 혁신 및 처우 개선
            """
        },
        {
            "title": "3. 사회안전망 강화",
            "content": """
            ▪ 기초생활보장제도 개선 및 사각지대 해소
            ▪ 의료접근성 향상 및 공공의료 인프라 확충
            ▪ 돌봄서비스 확대 및 가족친화적 정책 추진
            ▪ 사회적 약자 보호 및 포용사회 실현
            
            주요 추진과제:
            - 기초생활보장 수급기준 현실화
            - 지역별 공공병원 확충 및 의료진 확보
            - 국공립어린이집 확대 및 방과후돌봄 강화
            - 장애인 권익보장 및 접근성 개선
            """
        }
    ]
    
    for policy in policies:
        story.append(Paragraph(policy["title"], heading_style))
        story.append(Paragraph(policy["content"], normal_style))
        story.append(Spacer(1, 20))
    
    doc.build(story)

def create_economy_documents(docs_folder, title_style, heading_style, normal_style):
    """경제정책 문서들 생성"""
    
    # 창업기업 생태계 구축 방안
    doc1 = SimpleDocTemplate(f"{docs_folder}/창업기업_생태계_구축방안.pdf", pagesize=A4)
    story1 = []
    story1.append(Paragraph("창업기업 생태계 구축 방안", title_style))
    story1.append(Paragraph("발행: 자유와혁신 경제정책위원회", normal_style))
    story1.append(Spacer(1, 20))
    story1.append(Paragraph("1. 현황 분석", heading_style))
    story1.append(Paragraph("국내 창업 생태계는 아직 초기 단계이며, 체계적인 지원 시스템 구축이 필요합니다.", normal_style))
    story1.append(Paragraph("2. 정책 방향", heading_style))
    story1.append(Paragraph("▪ 창업지원센터 전국 네트워크 구축\n▪ 멘토링 프로그램 운영\n▪ 투자유치 지원 시스템 구축", normal_style))
    doc1.build(story1)
    
    # 4차 산업혁명 대응 전략
    doc2 = SimpleDocTemplate(f"{docs_folder}/4차산업혁명_대응전략.pdf", pagesize=A4)
    story2 = []
    story2.append(Paragraph("4차 산업혁명 대응 전략", title_style))
    story2.append(Paragraph("발행: 자유와혁신 과학기술위원회", normal_style))
    story2.append(Spacer(1, 20))
    story2.append(Paragraph("1. 디지털 전환 가속화", heading_style))
    story2.append(Paragraph("AI, IoT, 빅데이터 등 신기술 도입을 통한 산업 혁신을 추진합니다.", normal_style))
    story2.append(Paragraph("2. 인력 양성 체계", heading_style))
    story2.append(Paragraph("▪ 디지털 리터러시 교육 확대\n▪ 재직자 재교육 프로그램\n▪ 신기술 분야 전문인력 양성", normal_style))
    doc2.build(story2)

def create_education_documents(docs_folder, title_style, heading_style, normal_style):
    """교육정책 문서들 생성"""
    
    # 개별 맞춤형 교육 시스템
    doc1 = SimpleDocTemplate(f"{docs_folder}/개별맞춤형_교육시스템.pdf", pagesize=A4)
    story1 = []
    story1.append(Paragraph("개별 맞춤형 교육 시스템", title_style))
    story1.append(Paragraph("발행: 자유와혁신 교육정책위원회", normal_style))
    story1.append(Spacer(1, 20))
    story1.append(Paragraph("1. 추진 배경", heading_style))
    story1.append(Paragraph("학습자 개별 특성을 고려한 맞춤형 교육이 미래 인재 양성의 핵심입니다.", normal_style))
    story1.append(Paragraph("2. 주요 내용", heading_style))
    story1.append(Paragraph("▪ AI 기반 학습 분석 시스템 도입\n▪ 개별 학습계획 수립 지원\n▪ 다양한 학습 방법 제공", normal_style))
    doc1.build(story1)
    
    # 사회 안전망 강화 정책
    doc2 = SimpleDocTemplate(f"{docs_folder}/사회안전망_강화정책.pdf", pagesize=A4)
    story2 = []
    story2.append(Paragraph("사회 안전망 강화 정책", title_style))
    story2.append(Paragraph("발행: 자유와혁신 사회정책위원회", normal_style))
    story2.append(Spacer(1, 20))
    story2.append(Paragraph("1. 기본 방향", heading_style))
    story2.append(Paragraph("모든 국민이 인간다운 삶을 영위할 수 있는 포용적 사회안전망 구축을 목표로 합니다.", normal_style))
    story2.append(Paragraph("2. 세부 정책", heading_style))
    story2.append(Paragraph("▪ 기초생활보장제도 개선\n▪ 의료 접근성 향상\n▪ 돌봄서비스 확대", normal_style))
    doc2.build(story2)

def create_security_documents(docs_folder, title_style, heading_style, normal_style):
    """안보정책 문서들 생성"""
    
    # 국가안보 정책 방향
    doc1 = SimpleDocTemplate(f"{docs_folder}/국가안보_정책방향.pdf", pagesize=A4)
    story1 = []
    story1.append(Paragraph("국가안보 정책 방향", title_style))
    story1.append(Paragraph("발행: 자유와혁신 외교안보위원회", normal_style))
    story1.append(Spacer(1, 20))
    story1.append(Paragraph("1. 기본 입장", heading_style))
    story1.append(Paragraph("자유민주주의 가치를 바탕으로 한 평화와 번영의 한반도 구현을 추구합니다.", normal_style))
    story1.append(Paragraph("2. 주요 정책", heading_style))
    story1.append(Paragraph("▪ 한미동맹 강화\n▪ 국방력 현대화\n▪ 사이버 보안 체계 구축", normal_style))
    doc1.build(story1)

if __name__ == "__main__":
    create_pdf_documents() 