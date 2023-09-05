# ERP SYSTEM

### Запуск

```sh
docker-compose up -d   # запускаем все контейнеры

docker-compose stop   # остановливаем все контейнеры
```

### API (Backend) & UI (Frontend)

##### Общие команды для api и ui

```sh
docker-compose logs api -f   # следим за логами контейнера

docker-compose exec api /bin/bash   # запускаем терминал контейнера
```

##### Специфические команды для api (внутри контейнера)

```sh
manage createsuperuser   # создаем суперпользователя

manage makemigrations   # создаем миграции

manage migrate   # применяем миграции
```

```sh
text index   # индексируем строки с переводами

text generate   # генерирует файлы с переводами
```
