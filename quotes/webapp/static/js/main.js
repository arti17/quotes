// Получение всех цитат
function getQuotes() {
    $.ajax({
        url: 'http://localhost:8000/api/quotes/',
        method: 'GET',
        dataType: 'json',
        contentType: 'applications/json',
        headers: {'Authorization': localStorage.getItem('apiToken')},
        success: function (response, status) {
            console.log(response)
            renderContent(response)
            if (localStorage.getItem('apiToken')) {
                $('.edit_quote').removeClass('d-none')
                $('.delete_quote').removeClass('d-none')
                $('#auth_login').addClass('invisible')
                $('#auth_logout').removeClass('invisible')
            }
        },
        error: function (response, status) {
            console.log(response)
        }
    })
}

// Добавление рейтинга
function addRating(id) {
    $.ajax({
        url: `http://localhost:8000/api/quotes/${id}/add/`,
        method: 'POST',
        success: function (response, status) {
            const quote_rating = $(`#rating_${response.id}`)
            quote_rating.text(response.rating)
        },
        error: function (response, status) {
            console.log(response)
        }
    })
}

// Снижение рейтинга
function subRating(id) {
    $.ajax({
        url: `http://localhost:8000/api/quotes/${id}/sub/`,
        method: 'POST',
        success: function (response, status) {
            const quote_rating = $(`#rating_${response.id}`)
            quote_rating.text(response.rating)
        },
        error: function (response, status) {
            console.log(response)
        }
    })
}

// Вывод цитат на странцице
function renderContent(response) {
    const quotes = $('.quotes')
    quotes.empty()

    for (let i = 0; i < response.length; i++) {
        const date = new Date(Date.parse(response[i].created_at))

        const quote = `
            <div class="card mt-3">
            <div class="card-header">
                <small class="text-primary">Рейтинг: <span id="rating_${response[i].id}">${response[i].rating}</span></small>
                <div class="btn-group ml-4" role="group">
                  <button type="button" class="btn btn-success" onclick="addRating(${response[i].id})">+</button>
                  <button type="button" class="btn btn-danger" onclick="subRating(${response[i].id})">-</button>
                </div>
                <div class="d-inline-block float-right">
                    <ul class="nav nav-pills card-header-pills">
                        <li class="nav-item d-none edit_quote">
                            <button class="nav-link text-success" data-toggle="modal" data-target="#editModal" 
                                    data-whatever="${response[i].author_name}|${response[i].author_email}|${response[i].text}|${response[i].status}|${response[i].id}">Редактировать</button>
                        </li>
                        <li class="nav-item ml-1 d-none delete_quote">
                            <button class="nav-link text-danger"  onclick="deleteQuote(${response[i].id})">Удалить</button>
                        </li>
                        <li class="nav-item ml-1" id="view_quote">
                            <button class="nav-link text-primary" onclick="viewQuote(${response[i].id})">Просмотр</button>
                        </li>
                    </ul>
                </div>
                
            </div>
            <div class="card-body">
                <blockquote class="blockquote mb-0">
                    <p>${response[i].text}</p>
                    <footer class="blockquote-footer">
                        ${response[i].author_name}
                        <small class="text-muted d-block text-right">Создана: ${date.toLocaleString()}</small>
                    </footer>
                </blockquote>
            </div>
        </div>
    `
        quotes.append(quote)
    }
}

// Заполнение модального окна редактирования цитаты
$('#editModal').on('show.bs.modal', function (event) {
    const button = $(event.relatedTarget)
    const data = button.data('whatever')
    const data_list = data.split('|')
    const modal = $(this)
    modal.find('.modal-body #e_author').val(data_list[0])
    modal.find('.modal-body #e_email').val(data_list[1])
    modal.find('.modal-body #e_text').val(data_list[2])
    modal.find('.modal-body #e_status').val(data_list[3])
    modal.find('.modal-body #e_id').val(data_list[4])
})

//Редактирование цитаты
function editQuote() {
    const author = $('#e_author').val()
    const email = $('#e_email').val()
    const text = $('#e_text').val()
    const status = $('#e_status').val()
    const id = $('#e_id').val()

    $.ajax({
        url: `http://localhost:8000/api/quotes/${id}/`,
        method: 'PATCH',
        headers: {'Authorization': localStorage.getItem('apiToken')},
        data: JSON.stringify({"text": text, "author_name": author, "author_email": email, "status": status}),
        dataType: 'json',
        contentType: 'application/json',
        success: function (response, status) {
            getQuotes()
            $('#message').text('Цитата обновлена')
            $('#message').removeClass('d-none')
            $('#message').removeClass('alert-danger')
            $('#editModal').modal('hide')
        },
        error: function (response, status) {
            console.log(response)
        }
    })

}

// Добавление цитаты
$('#add_quote').click(function () {
    const text = $('#text').val()
    const author = $('#author').val()
    const email = $('#email').val()

    $.ajax({
        url: 'http://localhost:8000/api/quotes/',
        method: 'POST',
        data: JSON.stringify({"text": text, "author_name": author, "author_email": email}),
        dataType: 'json',
        contentType: 'application/json',
        success: function (response, status) {
            getQuotes()
            $('#message').text('Цитата добавлена и будет опубликована после проверки администратором.')
            $('#message').removeClass('d-none')
            $('#message').removeClass('alert-danger')
        },
        error: function (response, status) {
            $('#message').removeClass('d-none')
            $('#message').text('Заполните корректно все поля')
            $('#message').addClass('alert-danger')
        }
    })
})

// Просмотр цитаты
function viewQuote(id) {
    $('#back_to_main').removeClass('d-none')
    $.ajax({
        url: `http://localhost:8000/api/quotes/${id}`,
        headers: {'Authorization': localStorage.getItem('apiToken')},
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (response, status) {
            renderContent([response])
        },
        error: function (response, status) {
            console.log(response)
        }
    })
}

// Функция возвращения на главную страницу
function backToMain() {
    getQuotes()
    $('#back_to_main').addClass('d-none')
}

// Авторизация
function loginFunc() {
    const login = $('#login').val()
    const password = $('#password').val()

    $.ajax({
        url: 'http://localhost:8000/api/login/',
        method: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({"username": login, "password": password}),
        success: function (response, status) {
            localStorage.setItem('apiToken', 'Token ' + response.token)
            $('#auth_login').addClass('invisible')
            $('#auth_logout').removeClass('invisible')
            $('.edit_quote').removeClass('d-none')
            $('.delete_quote').removeClass('d-none')
            $('#authModal').modal('hide')
            getQuotes()

        },
        error: function (response, status) {
            console.log(response)
        },
    })
}

// Выход
function logoutFunc() {
    $.ajax({
        url: 'http://localhost:8000/api/logout/',
        method: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        success: function (response, status) {
            localStorage.removeItem('apiToken')
            $('#auth_login').removeClass('invisible')
            $('#auth_logout').addClass('invisible')
            $('.edit_quote').addClass('d-none')
            $('.delete_quote').addClass('d-none')
            getQuotes()
        },
        error: function (response, status) {
            console.log(response)
        },
    })
}

// Удаление цитаты
function deleteQuote(id) {
    $.ajax({
        url: `http://localhost:8000/api/quotes/${id}/`,
        method: 'DELETE',
        headers: {'Authorization': localStorage.getItem('apiToken')},
        contentType: 'application/json',
        dataType: 'json',
        success: function (response, status) {
            $('#message').text('Цитата удалена')
            $('#message').removeClass('d-none')
            getQuotes()
        },
        error: function (response, status) {
            console.log(response)
        },
    })
}

$(document).ready(function () {
    getQuotes()
})