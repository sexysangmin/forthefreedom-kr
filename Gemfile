source "https://rubygems.org"

gem "jekyll", "~> 4.3"
gem "minima", "~> 2.5"

# Jekyll 플러그인들
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
  gem "jekyll-sitemap"
  gem "jekyll-seo-tag"
  gem "jekyll-paginate"
end

# Windows와 JRuby에서는 timezone 정보가 포함되지 않으므로 추가
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance 향상을 위한 wdm (Windows만)
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]

# JRuby 사용시 HTTP parser 추가
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]

# Netlify 빌드를 위한 추가 패키지
gem "webrick", "~> 1.7" 