// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/signin', '/signup', '/public']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  // ✅ Bỏ qua các file static như ảnh, font, script...
  if (
    pathname.startsWith('/_next') || // Next.js static files
    pathname.startsWith('/images') || // ảnh từ public/images
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(.*)\.(jpg|jpeg|png|svg|webp|gif|woff|woff2|ttf|otf)$/)
  ) {
    return NextResponse.next()
  }

  const isPublic = PUBLIC_PATHS.some(path => pathname.startsWith(path))

  // Nếu đã login => không cho vào lại /signin
  if (token && pathname === '/signin') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Nếu chưa login => chặn mọi đường dẫn private
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  return NextResponse.next()
}

// Áp dụng middleware cho tất cả route trừ public
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
