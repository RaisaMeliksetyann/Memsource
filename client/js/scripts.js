window.addEventListener('load', () => {
    const $mainContainer = $('#mainContainer');
  
    // Compile Handlebar Templates
    const errorTemplate = Handlebars.compile($('#error-template').html());
    const loginTemplate = Handlebars.compile($('#login-template').html());
    const projectsTemplate = Handlebars.compile($('#projects-template').html());
  
    // Router Declaration
    const router = new Router({
        mode: 'history',
        page404: (path) => {
        const html = errorTemplate({
            color: 'yellow',
            title: 'Error 404 - Page NOT Found!',
            message: `The path '/${path}' does not exist on this site`,
        });
        $mainContainer.html(html);
        },
    });

    // API 
    const api = axios.create({
        baseURL: 'https://cloud.memsource.com/web/api2/v1',
        headers: {'content-type': 'application/json; charset=utf-8'}
    });

    const loginUser = async (e) => {
        e.preventDefault();

        const userName = $('#userEmail').val();
        const password = $('#userPassword').val();
        const credentials = { userName, password };

        try {
            const response = await api.post('/auth/login', JSON.stringify(credentials));
            localStorage.token = response.token || '';
        } catch (error) {
            console.log( error );
        } 
    };
    
    router.add('/login', () => {
        if(localStorage && localStorage.token) {
            router.navigateTo('/projects');
        }
        else {
            let html = loginTemplate();
            $mainContainer.html(html);
    
            $('.credentialsForm').on('submit', loginUser);
        }
    });
    
    router.add('/projects', async () => {

        if(localStorage && localStorage.token) {
            let html = projectsTemplate();
            $mainContainer.html(html);

            const token = localStorage.token;

            try {
                const response = await api.get(`/projects?token=${token}`);
                const { content } = response.data;

                html = projectsTemplate({ content });
                $mainContainer.html(html);
            } catch (error) {
                console.log( error );
            } 
        } 
        else {
            router.navigateTo('/login');
        }
    });
    
    // Navigate app to current url
    router.navigateTo(window.location.pathname);
    
    // Highlight Active Menu on Refresh/Page Reload
    const link = $(`a[href$='${window.location.pathname}']`);
    link.addClass('active');
    
    $('a').on('click', (e) => {
        // prevent page load
        e.preventDefault();
    
        // highlight active menu
        const target = $(e.target);
        $('.item').removeClass('active');
        target.addClass('active');
    
        // navigate to the url
        const href = target.attr('href');
        const path = href.substr(href.lastIndexOf('/'));
        router.navigateTo(path);
    });
  });