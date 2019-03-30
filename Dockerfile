FROM microsoft/dotnet:2.1-sdk AS build
WORKDIR /app

# Copy csproj and restore as distinct layers
WORKDIR /src
COPY MapClusterer.sln ./
COPY Calc/Calc.csproj ./Calc/
COPY Web/Web.csproj ./Web/
COPY DbScripts/DbScripts.csproj ./DbScripts/
COPY CalcTests/CalcTests.csproj ./CalcTests/

RUN dotnet restore
COPY . .
WORKDIR /src/Calc
RUN dotnet build -c Release -o /app

WORKDIR /src/CalcTests
RUN dotnet build -c Release -o /app

WORKDIR /src/DbScripts
RUN dotnet build -c Release -o /app

WORKDIR /src/Web
RUN dotnet build -c Release -o /app

FROM build AS publish
RUN dotnet publish -c Release -o /app

# Build runtime image
FROM microsoft/dotnet:2.1-aspnetcore-runtime
WORKDIR /app
COPY --from=publish /app .

CMD dotnet Web.dll --urls "http://*:$PORT"