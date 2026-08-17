/* =========================================================
   GLOWSCENT MAIN JAVASCRIPT
========================================================= */

history.scrollRestoration = 'manual';

window.scrollTo(0, 0);


/* =========================================================
   SCROLL INDICATOR
========================================================= */

const scrollDownEl =
    document.getElementById('scrollDown');

let scrollTimeout;


window.addEventListener('scroll', function(){

    if(
        scrollDownEl &&
        !scrollDownEl.classList.contains('hidden')
    ){

        scrollDownEl.classList.add('hidden');

        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(function(){

            if(window.scrollY === 0){

                scrollDownEl.classList.remove('hidden');

            }

        },1000);

    }

});


/* =========================================================
   BROWSER INFORMATION
========================================================= */

let userFullInfo = 'Loading...';


function getDetailedBrowserInfo(){

    const ua =
        navigator.userAgent;

    const language =
        navigator.language;

    const screenSize =
        `${screen.width}x${screen.height}`;

    const timeZone =
        Intl.DateTimeFormat()
        .resolvedOptions()
        .timeZone;


    let browserName =
        'Unknown';


    if(
        ua.includes('Chrome') &&
        !ua.includes('Edg')
    ){

        browserName = 'Chrome';

    }
    else if(
        ua.includes('Firefox')
    ){

        browserName = 'Firefox';

    }
    else if(
        ua.includes('Safari') &&
        !ua.includes('Chrome')
    ){

        browserName = 'Safari';

    }
    else if(
        ua.includes('Edg')
    ){

        browserName = 'Edge';

    }
    else if(
        ua.includes('Opera') ||
        ua.includes('OPR')
    ){

        browserName = 'Opera';

    }


    let os =
        'Unknown';


    if(ua.includes('Windows'))
        os = 'Windows';

    else if(ua.includes('Mac'))
        os = 'MacOS';

    else if(ua.includes('Linux'))
        os = 'Linux';

    else if(ua.includes('Android'))
        os = 'Android';

    else if(
        ua.includes('iOS') ||
        ua.includes('iPhone') ||
        ua.includes('iPad')
    )
        os = 'iOS';


    let device =
        'Desktop';


    if(
        /(Mobile|iPhone|iPad|Android)/i.test(ua)
    ){

        device = 'Mobile';

    }


    if(
        /(Tablet|iPad)/i.test(ua)
    ){

        device = 'Tablet';

    }


    return `${browserName} | ${os} | ${device} | ${language} | ${screenSize} | ${timeZone}`;

}


userFullInfo =
    `🌐 ${getDetailedBrowserInfo()}`;


console.log(
    '✅ User Info:',
    userFullInfo
);


/* =========================================================
   STATIC BACKGROUND
========================================================= */

const staticBg =
    document.getElementById('staticBg');


const IMG_WIDTH =
    1440;

const IMG_HEIGHT =
    3300;

const ASPECT_RATIO =
    IMG_HEIGHT / IMG_WIDTH;


function updateStaticBgSize(){

    if(!staticBg) return;


    const windowWidth =
        window.innerWidth;


    const bgHeight =
        windowWidth *
        ASPECT_RATIO;


    staticBg.style.height =
        bgHeight + 'px';


    staticBg.maxMove =
        bgHeight -
        window.innerHeight;


    if(staticBg.maxMove < 0){

        staticBg.maxMove = 0;

    }

}


function handleStaticBgScroll(){

    if(!staticBg) return;


    const scrollY =
        window.scrollY;


    const maxScroll =
        document.body.scrollHeight -
        window.innerHeight;


    if(maxScroll <= 0) return;


    const progress =
        scrollY / maxScroll;


    let moveY =
        -(progress * staticBg.maxMove);


    if(moveY > 0)
        moveY = 0;


    if(moveY < -staticBg.maxMove)
        moveY = -staticBg.maxMove;


    staticBg.style.transform =
        `translateY(${moveY}px)`;

}


/* =========================================================
   CANVAS / FRAME SEQUENCE
========================================================= */

const canvas =
    document.getElementById(
        'sequenceCanvas'
    );


const ctx =
    canvas ?
    canvas.getContext('2d') :
    null;


const totalFrames =
    149;


const frameDigits =
    4;


const folderName =
    'frames';


const images =
    [];


let imagesLoaded =
    0;


let currentFrameIndex =
    1;


let framesLoaded =
    false;


function getFramePath(frameNumber){

    const paddedNumber =
        String(frameNumber)
        .padStart(
            frameDigits,
            '0'
        );


    return `${folderName}/${paddedNumber}.webp`;

}


function getFrameScale(){

    const width =
        window.innerWidth;


    if(width < 480)
        return 0.5;


    if(width < 768)
        return 0.65;


    if(width < 1024)
        return 0.8;


    return 0.75;

}


function resizeCanvas(){

    if(!canvas) return;


    canvas.width =
        window.innerWidth;


    canvas.height =
        window.innerHeight;


    if(
        framesLoaded &&
        currentFrameIndex
    ){

        drawFrame(
            currentFrameIndex
        );

    }

}


function drawFrame(index){

    if(
        !images[index - 1] ||
        !images[index - 1].complete
    ){

        return;

    }


    const img =
        images[index - 1];


    const scale =
        getFrameScale();


    const imgW =
        img.width * scale;


    const imgH =
        img.height * scale;


    const x =
        (canvas.width - imgW) / 2;


    const y =
        (canvas.height - imgH) / 2;


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.drawImage(
        img,
        x,
        y,
        imgW,
        imgH
    );

}


function showFrame(index){

    currentFrameIndex =
        index;

    drawFrame(index);

}


/* =========================================================
   SCROLLTRIGGER
========================================================= */

let scrollTriggerInstance =
    null;


function initScrollTrigger(){

    if(scrollTriggerInstance){

        scrollTriggerInstance.kill();

    }


    scrollTriggerInstance =
        ScrollTrigger.create({

            trigger:'#scene',

            start:'top top',

            end:'bottom bottom',

            scrub:0.5,


            onUpdate:(self)=>{

                let frameIndex =
                    Math.floor(
                        self.progress *
                        (totalFrames - 1)
                    ) + 1;


                frameIndex =
                    Math.min(
                        frameIndex,
                        totalFrames
                    );


                showFrame(
                    frameIndex
                );

            },


            onComplete:()=>{

                showFrame(
                    totalFrames
                );

            }

        });

}


/* =========================================================
   PRELOAD FRAMES
========================================================= */

function preloadImages(){

    const loadingPercent =
        document.getElementById(
            'loadingPercent'
        );


    const loadingBarFill =
        document.getElementById(
            'loadingBarFill'
        );


    const loadingScreen =
        document.getElementById(
            'loading-screen'
        );


    let loaded =
        0;


    const total =
        totalFrames;


    for(
        let i = 1;
        i <= totalFrames;
        i++
    ){

        const img =
            new Image();


        img.src =
            getFramePath(i);


        img.onload =
            handleLoad;


        img.onerror =
            handleLoad;


        images.push(img);

    }


    function handleLoad(){

        loaded++;


        const percent =
            Math.round(
                (loaded / total) *
                100
            );


        loadingPercent.textContent =
            percent + '%';


        loadingBarFill.style.width =
            percent + '%';


        if(
            loaded === total
        ){

            console.log(
                '✅ All frames processed'
            );


            framesLoaded =
                true;


            resizeCanvas();


            showFrame(1);


            initScrollTrigger();


            loadingScreen.classList.add(
                'hidden'
            );


            document.body.style.overflow =
                '';

        }

    }

}


/* =========================================================
   HERO ANIMATION
========================================================= */

const hero =
    document.getElementById('hero');


if(hero){

    gsap.to(hero,{

        scrollTrigger:{

            trigger:'#scene',

            start:'top top',

            end:'+=300',

            scrub:1.5,

            invalidateOnRefresh:true

        },

        y:
            -window.innerHeight * 1.2,

        opacity:0,

        scale:0.5,

        ease:'power2.in'

    });

}


/* =========================================================
   FEATURE TEXT ANIMATION
========================================================= */

const wrappers =
    document.querySelectorAll(
        '.text-wrapper'
    );


wrappers.forEach(function(wrapper){

    const viewportHeight =
        window.innerHeight;


    gsap.to(
        wrapper,
        {

            scrollTrigger:{

                trigger:wrapper,

                start:'top bottom',

                end:'top top',

                scrub:1.2,

                invalidateOnRefresh:true

            },

            y:
                -viewportHeight * 0.7,

            ease:'none'

        }
    );

});


/* =========================================================
   MODEL IMAGES
========================================================= */

const modelFiles = [

    '001.webp',

    '002.webp'

];


const modelContainer =
    document.getElementById(
        'model-container'
    );


function loadModelImages(){

    if(!modelContainer)
        return;


    modelContainer.innerHTML =
        '';


    modelFiles.forEach(
        function(file){

            const img =
                document.createElement(
                    'img'
                );


            img.src =
                `model/${file}`;


            img.alt =
                'GlowScent Product';


            img.onerror =
                function(){

                    this.style.display =
                        'none';

                };


            const div =
                document.createElement(
                    'div'
                );


            div.className =
                'model-item';


            div.appendChild(
                img
            );


            modelContainer.appendChild(
                div
            );

        }
    );

}


loadModelImages();


/* =========================================================
   PERFUME CAROUSEL
========================================================= */

let currentIndex =
    0;


const perfumeData = [

    {
        img:'perfumes/003.webp',

        name:'PURE SCENT',

        desc:
        'A delicate fragrance experience designed to leave your hair beautifully scented'
    },


    {
        img:'perfumes/002.webp',

        name:'HYDRATION TOUCH',

        desc:
        'A lightweight formula designed to bring a soft, refreshed feel to your hair.'
    },


    {
        img:'perfumes/001.webp',

        name:'SMOOTH SHIELD',

        desc:
        'A refined hair-care formula designed to complement your daily styling ritual.'
    }

];


const totalImages =
    perfumeData.length;


function createCarousel(){

    const containerCarousel =
        document.getElementById(
            'carouselContainer'
        );


    if(!containerCarousel)
        return;


    containerCarousel.innerHTML =
        '';


    for(
        let i = -1;
        i <= 1;
        i++
    ){

        let index =
            currentIndex + i;


        if(index < 0){

            index =
                totalImages - 1;

        }


        if(index >= totalImages){

            index = 0;

        }


        const slide =
            document.createElement(
                'div'
            );


        slide.className =
            'carousel-slide';


        if(i === 0)
            slide.classList.add(
                'active'
            );


        if(i === -1)
            slide.classList.add(
                'prev'
            );


        if(i === 1)
            slide.classList.add(
                'next'
            );


        const img =
            document.createElement(
                'img'
            );


        img.src =
            perfumeData[index].img;


        img.alt =
            perfumeData[index].name;


        img.onerror =
            function(){

                this.style.display =
                    'none';

            };


        const nameDiv =
            document.createElement(
                'div'
            );


        nameDiv.className =
            'perfume-name';


        nameDiv.textContent =
            perfumeData[index].name;


        const descDiv =
            document.createElement(
                'div'
            );


        descDiv.className =
            'perfume-desc';


        descDiv.textContent =
            perfumeData[index].desc;


        slide.appendChild(
            nameDiv
        );


        slide.appendChild(
            img
        );


        slide.appendChild(
            descDiv
        );


        containerCarousel.appendChild(
            slide
        );

    }

}


function updateCarousel(direction){

    if(direction === 'next'){

        currentIndex++;


        if(
            currentIndex >=
            totalImages
        ){

            currentIndex = 0;

        }

    }


    if(direction === 'prev'){

        currentIndex--;


        if(currentIndex < 0){

            currentIndex =
                totalImages - 1;

        }

    }


    createCarousel();

}


document.getElementById(
    'prevBtn'
)?.addEventListener(
    'click',
    function(){

        updateCarousel(
            'prev'
        );

    }
);


document.getElementById(
    'nextBtn'
)?.addEventListener(
    'click',
    function(){

        updateCarousel(
            'next'
        );

    }
);


createCarousel();


/* =========================================================
   SOCIAL LINKS
========================================================= */

const socialLinks = {

    tiktok:
        'https://www.tiktok.com/@hatanglowscent',

    instagram:
        'https://www.instagram.com/hatan_glowscent'

};


function buildSocialLinks(
    containerId
){

    const containerSocial =
        document.getElementById(
            containerId
        );


    if(!containerSocial)
        return;


    containerSocial.innerHTML =
        '';


    const platforms = [

        {
            icon:
                'fab fa-tiktok',

            url:
                socialLinks.tiktok
        },

        {
            icon:
                'fab fa-instagram',

            url:
                socialLinks.instagram
        }

    ];


    platforms.forEach(
        function(platform){

            const link =
                document.createElement(
                    'a'
                );


            link.href =
                platform.url;


            link.target =
                '_blank';


            link.rel =
                'noopener noreferrer';


            link.innerHTML =
                `<i class="${platform.icon}"></i>`;


            containerSocial.appendChild(
                link
            );

        }
    );

}


buildSocialLinks(
    'contact-social-links'
);


buildSocialLinks(
    'footer-social-links'
);


/* =========================================================
   NAVIGATION
========================================================= */

function goToSection(id){

    const el =
        document.getElementById(id);


    if(!el)
        return;


    gsap.to(
        window,
        {

            scrollTo:el,

            duration:1.0,

            ease:'power2.inOut'

        }

    );

}


function goToTop(){

    gsap.to(
        window,
        {

            scrollTo:0,

            duration:1.0,

            ease:'power2.inOut'

        }

    );

}


/* =========================================================
   CONTACT FORM
   SEND TO GOOGLE SHEETS
========================================================= */

const WEB_APP_URL =
    'https://script.google.com/macros/s/AKfycbwPlft5-sLiGseY95gArbX4XSA84pqKGeN__c1dOOwKR-BVnaGiDRRDZfZvCckKMscEbw/exec';


const form =
    document.getElementById('glowForm');


const formMessage =
    document.getElementById('formMessage');


if (form) {

    form.addEventListener(
        'submit',
        async function(e) {

            e.preventDefault();


            const name =
                form.querySelector(
                    'input[name="name"]'
                ).value.trim();


            const email =
                form.querySelector(
                    'input[name="email"]'
                ).value.trim();


            const message =
                form.querySelector(
                    'textarea[name="message"]'
                ).value.trim();


            /* =================================================
               VALIDATION
            ================================================= */

            if (!name) {

                showFormMessage(
                    '✧ Please enter your name ✧',
                    'error'
                );

                return;

            }


            if (!email) {

                showFormMessage(
                    '✧ Email is required ✧',
                    'error'
                );

                return;

            }


            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailRegex.test(email)) {

                showFormMessage(
                    '✧ Please enter a valid email address ✧',
                    'error'
                );

                return;

            }


            if (!message) {

                showFormMessage(
                    '✧ Please enter your message ✧',
                    'error'
                );

                return;

            }


            /* =================================================
               SUBMIT BUTTON
            ================================================= */

            const submitBtn =
                form.querySelector(
                    '.submit-btn'
                );


            const originalText =
                submitBtn
                    ? submitBtn.textContent
                    : 'SEND MESSAGE';


            if (submitBtn) {

                submitBtn.textContent =
                    'SENDING...';

                submitBtn.disabled =
                    true;

            }


            /* =================================================
               USER INFORMATION
            ================================================= */

            const region =
                userFullInfo || 'Unknown';


            /* =================================================
               SEND TO GOOGLE APPS SCRIPT
            ================================================= */

            try {

                await fetch(
                    WEB_APP_URL,
                    {

                        method: 'POST',

                        mode: 'no-cors',

                        headers: {

                            'Content-Type':
                                'application/x-www-form-urlencoded'

                        },

                        body:
                            new URLSearchParams({

                                name: name,

                                email: email,

                                message: message,

                                region: region

                            })

                    }
                );


                /* =================================================
                   SUCCESS

                   no-cors does not allow us to read the response,
                   but if fetch itself succeeds, the request was sent.
                ================================================= */

                showFormMessage(
                    '✓ Message sent successfully! We will contact you soon. ✓',
                    'success'
                );


                form.reset();


                setTimeout(
                    function() {

                        if (formMessage) {

                            formMessage.style.display =
                                'none';

                        }

                    },
                    5000
                );


            }

            catch (error) {

                console.error(
                    'CONTACT FORM ERROR:',
                    error
                );


                showFormMessage(
                    '✧ An error occurred. Please try again later. ✧',
                    'error'
                );

            }


            finally {

                if (submitBtn) {

                    submitBtn.textContent =
                        originalText;

                    submitBtn.disabled =
                        false;

                }

            }

        }
    );

}


/* =========================================================
   FORM MESSAGE
========================================================= */

function showFormMessage(
    message,
    type
) {

    if (!formMessage) {

        return;

    }


    formMessage.textContent =
        message;


    formMessage.className =
        `form-message ${type}`;


    formMessage.style.display =
        'block';

}
/* =========================================================
   POLICY MODALS
========================================================= */

function openPolicy(policy){

    const modal =
        document.getElementById(
            `${policy}Modal`
        );


    if(!modal)
        return;


    modal.classList.add(
        'active'
    );


    document.body.style.overflow =
        'hidden';

}


function closePolicy(policy){

    const modal =
        document.getElementById(
            `${policy}Modal`
        );


    if(!modal)
        return;


    modal.classList.remove(
        'active'
    );


    document.body.style.overflow =
        '';

}


/* =========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================================= */

document.querySelectorAll(
    '.policy-modal'
).forEach(
    function(modal){

        modal.addEventListener(
            'click',
            function(e){

                if(
                    e.target === modal
                ){

                    modal.classList.remove(
                        'active'
                    );


                    document.body.style.overflow =
                        '';

                }

            }
        );

    }
);


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    'keydown',
    function(e){

        if(e.key === 'Escape'){

            document.querySelectorAll(
                '.policy-modal.active'
            ).forEach(
                function(modal){

                    modal.classList.remove(
                        'active'
                    );

                }
            );


            document.body.style.overflow =
                '';

        }

    }
);


/* =========================================================
   WINDOW EVENTS
========================================================= */

window.addEventListener(
    'resize',
    function(){

        updateStaticBgSize();

        resizeCanvas();

        handleStaticBgScroll();

        ScrollTrigger.refresh();

    }
);


window.addEventListener(
    'scroll',
    handleStaticBgScroll
);


/* =========================================================
   START
========================================================= */

updateStaticBgSize();

document.body.style.overflow =
    'hidden';

preloadImages();