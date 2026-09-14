using System.Reflection;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using KararOS.Application.Services;
using KararOS.Application.Services.Interfaces;

namespace KararOS.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        //fluentvaldiiton dorğulaacıalrını otomatrik tarıcaz ve kaydedicez
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        //servis kaydetme
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IBudgetService, BudgetService>();
        services.AddScoped<IDecisionService, DecisionService>();
        services.AddScoped<IInsightService, InsightService>();
        services.AddScoped<IVerificationCodeService, VerificationCodeService>();

        return services;
    }
}