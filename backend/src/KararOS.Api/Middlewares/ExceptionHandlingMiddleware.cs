using System.Net;
using System.Text.Json;
using FluentValidation;

namespace KararOS.Api.Middlewares;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next; //hataları bir sonraki http middleware aktarır
    private readonly ILogger<ExceptionHandlingMiddleware> _logger; //gerçeklşen olatları hataları kaydeder

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "İstek işlenirken bir hata oluştu: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var code = HttpStatusCode.InternalServerError;
        object response;

        switch (exception)
        {
            case ValidationException validationEx:
                code = HttpStatusCode.BadRequest;
                response = new
                {
                    title = "Doğrulama Hatası",
                    status = (int)code,
                    errors = validationEx.Errors.Select(e => new { property = e.PropertyName, error = e.ErrorMessage })
                };
                break;

            case InvalidOperationException invalidOpEx:
                code = HttpStatusCode.BadRequest;
                response = new
                {
                    title = "İşlem Hatası",
                    status = (int)code,
                    detail = invalidOpEx.Message
                };
                break;

            case KeyNotFoundException notFoundEx:
                code = HttpStatusCode.NotFound;
                response = new
                {
                    title = "Kayıt Bulunamadı",
                    status = (int)code,
                    detail = notFoundEx.Message
                };
                break;

            case UnauthorizedAccessException:
                code = HttpStatusCode.Unauthorized;
                response = new
                {
                    title = "Yetkisiz Erişim",
                    status = (int)code,
                    detail = "Bu işlem için yetkiniz bulunmamaktadır."
                };
                break;

            default:
                response = new
                {
                    title = "Sunucu Hatası",
                    status = (int)code,
                    detail = "Beklenmeyen bir sunucu hatası meydana geldi."
                };
                break;
        }

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)code;

        var json = JsonSerializer.Serialize(response);
        return context.Response.WriteAsync(json);
    }
}
