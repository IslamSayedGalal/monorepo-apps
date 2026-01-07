import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  // ANSI color codes
  private readonly colors = {
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    reset: '\x1b[0m',
    dim: '\x1b[2m',
  };

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const browserName = this.getBrowserName(userAgent);
    const now = Date.now();

    // Sanitize body to remove sensitive fields
    const sanitizedBody = this.sanitizeBody(body);

    // Log incoming request in yellow with larger icon
    const incomingMessage = `═══▶ ${method} ${url} ${JSON.stringify({
      query,
      params,
      body: sanitizedBody,
    })} - ${ip} - ${browserName}`;
    console.log(`${this.colors.yellow}${incomingMessage}${this.colors.reset}`);

    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const responseTime = Date.now() - now;

          // Log success response in green with SUCCESS label
          const successMessage = `◀═══ SUCCESS ${method} ${url} ${statusCode} ${responseTime}ms`;
          console.log(
            `${this.colors.green}${successMessage}${this.colors.reset}`
          );
        },
        error: (error) => {
          const responseTime = Date.now() - now;
          const statusCode = error.status || error.statusCode || 500;

          // Log error response in red with larger icon
          const errorMessage = `✗✗✗ ERROR ${method} ${url} ${statusCode} ${responseTime}ms - ${error.message}`;
          console.error(
            `${this.colors.red}${errorMessage}${this.colors.reset}`
          );
        },
      })
    );
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'apiKey',
      'authorization',
    ];
    const sanitized = { ...body };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '***';
      }
    }

    return sanitized;
  }

  private getBrowserName(userAgent: string): string {
    if (!userAgent) return 'Unknown';

    const ua = userAgent.toLowerCase();

    // Define detector type
    type Detector = {
      name: string;
      patterns: RegExp[];
      exclude?: string[];
    };

    // Define detection patterns in priority order
    // API Testing Tools (check first as they may contain browser strings)
    const apiTools: Detector[] = [
      {
        name: 'Postman',
        patterns: [/PostmanRuntime\/([\d.]+)/i, /Postman\/([\d.]+)/i],
      },
      { name: 'Insomnia', patterns: [/Insomnia\/([\d.]+)/i, /insomnia/i] },
      { name: 'Postwoman', patterns: [/Postwoman/i] },
      { name: 'API Dog', patterns: [/APIDog/i, /api-dog/i] },
      { name: 'Bruno', patterns: [/Bruno\/([\d.]+)/i, /bruno/i] },
      { name: 'Thunder Client', patterns: [/Thunder\s*Client/i] },
      { name: 'REST Client', patterns: [/REST\s*Client/i] },
      { name: 'HTTPie', patterns: [/HTTPie\/([\d.]+)/i, /httpie/i] },
      { name: 'Paw', patterns: [/Paw\/([\d.]+)/i] },
      { name: 'SoapUI', patterns: [/SoapUI/i] },
      { name: 'Swagger', patterns: [/Swagger/i, /swagger-ui/i] },
      { name: 'Postman Echo', patterns: [/PostmanEcho/i] },
      { name: 'RapidAPI', patterns: [/RapidAPI/i] },
      { name: 'Apigee', patterns: [/Apigee/i] },
      { name: 'Kong', patterns: [/Kong/i] },
      { name: 'cURL', patterns: [/curl\/([\d.]+)/i, /^curl/i] },
      { name: 'Wget', patterns: [/Wget\/([\d.]+)/i, /^wget/i] },
      { name: 'Axios', patterns: [/axios\/([\d.]+)/i] },
      { name: 'Fetch', patterns: [/node-fetch/i] },
    ];

    // Browsers (check after API tools)
    const browsers: Detector[] = [
      {
        name: 'Edge',
        patterns: [/Edg(?:e|A|iOS)?\/([\d.]+)/i, /Edg\/([\d.]+)/i],
      },
      { name: 'Opera', patterns: [/(?:Opera|OPR)\/([\d.]+)/i] },
      {
        name: 'Chrome',
        patterns: [/Chrome\/([\d.]+)/i],
        exclude: ['edg', 'opr'],
      },
      { name: 'Firefox', patterns: [/Firefox\/([\d.]+)/i, /FxiOS\/([\d.]+)/i] },
      {
        name: 'Safari',
        patterns: [/Version\/([\d.]+).*Safari/i, /Safari\/([\d.]+)/i],
        exclude: ['chrome', 'chromium', 'edg'],
      },
      { name: 'Brave', patterns: [/Brave/i] },
      { name: 'Vivaldi', patterns: [/Vivaldi\/([\d.]+)/i] },
      { name: 'Yandex', patterns: [/YaBrowser\/([\d.]+)/i] },
      { name: 'Samsung Internet', patterns: [/SamsungBrowser\/([\d.]+)/i] },
      { name: 'UC Browser', patterns: [/UCBrowser\/([\d.]+)/i] },
      { name: 'QQ Browser', patterns: [/QQBrowser\/([\d.]+)/i] },
      { name: 'Baidu Browser', patterns: [/BaiduHD/i] },
      { name: 'IE', patterns: [/MSIE\s+([\d.]+)/i, /Trident\/.*rv:([\d.]+)/i] },
      { name: 'Chromium', patterns: [/Chromium\/([\d.]+)/i] },
    ];

    // Mobile Apps
    const mobileApps: Detector[] = [
      { name: 'iOS App', patterns: [/CFNetwork/i] },
      { name: 'Android App', patterns: [/okhttp/i, /Dalvik/i] },
      { name: 'React Native', patterns: [/ReactNative/i] },
      { name: 'Flutter', patterns: [/Flutter/i] },
    ];

    // Combine all categories
    const allDetectors: Detector[] = [...apiTools, ...browsers, ...mobileApps];

    // Try each detector
    for (const detector of allDetectors) {
      for (const pattern of detector.patterns) {
        const match = userAgent.match(pattern);
        if (match) {
          // Check exclusions for browsers
          if (detector.exclude) {
            const shouldExclude = detector.exclude.some((exclude) =>
              ua.includes(exclude)
            );
            if (shouldExclude) continue;
          }

          // Extract version if available
          const version = match[1] || '';
          return version ? `${detector.name}/${version}` : detector.name;
        }
      }
    }

    // Fallback: Try to extract any recognizable name
    const fallbackPatterns = [
      { pattern: /([A-Za-z]+)\/([\d.]+)/, nameIndex: 1, versionIndex: 2 },
      { pattern: /([A-Za-z]+)\s+([\d.]+)/, nameIndex: 1, versionIndex: 2 },
    ];

    for (const fallback of fallbackPatterns) {
      const match = userAgent.match(fallback.pattern);
      if (match && match[fallback.nameIndex]) {
        const name = match[fallback.nameIndex];
        const version = match[fallback.versionIndex] || '';
        // Skip common words that aren't browser names
        if (
          ![
            'Mozilla',
            'AppleWebKit',
            'KHTML',
            'Gecko',
            'Version',
            'Mobile',
          ].includes(name)
        ) {
          return version ? `${name}/${version}` : name;
        }
      }
    }

    return 'Unknown';
  }
}
