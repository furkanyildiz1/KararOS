# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Proje dosyalarını kopyala ve restore et (Docker layer caching için)
COPY ["src/KararOS.Domain/KararOS.Domain.csproj", "src/KararOS.Domain/"]
COPY ["src/KararOS.Application/KararOS.Application.csproj", "src/KararOS.Application/"]
COPY ["src/KararOS.Infrastructure/KararOS.Infrastructure.csproj", "src/KararOS.Infrastructure/"]
COPY ["src/KararOS.Api/KararOS.Api.csproj", "src/KararOS.Api/"]

RUN dotnet restore "src/KararOS.Api/KararOS.Api.csproj"

# Tüm kaynak kodları kopyala ve Release olarak derle
COPY src/ src/
WORKDIR "/src/src/KararOS.Api"
RUN dotnet publish "KararOS.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage (.NET 9 lightweight image)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Render / Railway / Bulut servisleri varsayılan olarak PORT veya 8080 kullanır
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "KararOS.Api.dll"]
