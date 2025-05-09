// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

// Danh sách các route public không cần xác thực
const PUBLIC_PATHS = ['/signin', '/signup', '/public', '/api/auth']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  // Debug logging
  console.log('Middleware running for path:', pathname)
  console.log('Token exists:', !!token)
  console.log('All cookies:', request.cookies.getAll())

  // ✅ Bỏ qua các file static như ảnh, font, script...
  if (
    pathname.startsWith('/_next') || // Next.js static files
    pathname.startsWith('/images') || // ảnh từ public/images
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(.*)\.(jpg|jpeg|png|svg|webp|gif|woff|woff2|ttf|otf)$/)
  ) {
    console.log('Skipping static file:', pathname)
    return NextResponse.next()
  }

  // Kiểm tra xem route có phải là public không
  const isPublic = PUBLIC_PATHS.some(path => pathname.startsWith(path))
  console.log('Is public path:', isPublic)

  // Nếu đã login => không cho vào lại /signin
  if (token && pathname === '/signin') {
    console.log('Redirecting to home from signin')
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Nếu chưa login và không phải route public => chuyển hướng về trang đăng nhập
  if (!token && !isPublic) {
    console.log('No token, redirecting to signin')
    // Lưu URL hiện tại để redirect lại sau khi login
    const response = NextResponse.redirect(new URL('/signin', request.url))
    response.cookies.set('redirectUrl', pathname, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
    // Xóa token cũ nếu có
    response.cookies.set('token', '', {
      maxAge: 0,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
    return response
  }

  // Nếu có token, thêm token vào header của request
  if (token) {
    console.log('Adding token to headers')
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('Authorization', `Bearer ${token}`)
    
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
    return response
  }

  return NextResponse.next()
}

// Áp dụng middleware cho tất cả route trừ public
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
    '/', // Đảm bảo middleware chạy cho cả route gốc
  ],
}
