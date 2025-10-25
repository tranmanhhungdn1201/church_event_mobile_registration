# Hướng dẫn Deploy lên GitHub Pages

## Các bước đã thực hiện

### 1. Cài đặt dependencies
- Đã cài đặt `gh-pages` package để deploy
- Cấu hình `vite.config.ts` với base path cho GitHub Pages
- Thêm scripts deploy vào `package.json`

### 2. Cấu hình GitHub Actions
- Tạo file `.github/workflows/deploy.yml` để tự động deploy khi push code

## Cách deploy

### Phương pháp 1: Deploy thủ công
```bash
# Build và deploy
npm run deploy
```

### Phương pháp 1.5: Deploy nhanh với script
```bash
# Full deploy (auto commit + build + deploy)
./deploy.sh "Your commit message"

# Or quick deploy (build + deploy only)
./quick-deploy.sh
```

### Phương pháp 2: Deploy tự động với GitHub Actions

1. **Tạo repository trên GitHub:**
   - Tạo repository mới trên GitHub với tên `church_event_mobile_registration`
   - Không khởi tạo với README, .gitignore, hoặc license

2. **Push code lên GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/church_event_mobile_registration.git
   git push -u origin main
   ```

3. **Bật GitHub Pages:**
   - Vào Settings > Pages trong repository
   - Chọn Source: "GitHub Actions"
   - Workflow sẽ tự động chạy khi push code

4. **Truy cập ứng dụng:**
   - URL sẽ là: `https://YOUR_USERNAME.github.io/church_event_mobile_registration/`

## Lưu ý quan trọng

- Base path đã được cấu hình là `/church_event_mobile_registration/` trong `vite.config.ts`
- Nếu thay đổi tên repository, cần cập nhật base path trong `vite.config.ts`
- GitHub Actions sẽ tự động deploy mỗi khi push code lên branch `main`

## Troubleshooting

### Nếu trang không load đúng:
1. Kiểm tra base path trong `vite.config.ts`
2. Đảm bảo repository name khớp với base path
3. Kiểm tra GitHub Actions logs trong tab Actions

### Nếu có lỗi build:
1. Chạy `npm run build` locally để kiểm tra
2. Kiểm tra console trong GitHub Actions
3. Đảm bảo tất cả dependencies đã được cài đặt
