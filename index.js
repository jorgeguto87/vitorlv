const qrcode = require ('qrcode-terminal');
const { Client, List, Buttons, MessageTypes, MessageMedia, LocalAuth} = require ('whatsapp-web.js');
const client = new Client ({
    authStrategy: new LocalAuth()
});
const cron = require ('node-cron');
const fs = require ('fs');
const inicioatend = 8;
const fimatend = 20;
const folga = 0;
const feriados = [
    '01-01', // Ano Novo
    '04-21', // Tiradentes
    '05-01', // Dia do Trabalho
    '09-07', // Independência do Brasil
    '10-12', // Nossa Senhora Aparecida
    '11-02', // Finados
    '11-15', // Proclamação da República
    '12-25'  // Natal
];

const grupos = [
    '120363039621149962@g.us', 
    '5521992884522-1634652354@g.us',
    '120363045569895184@g.us',
    '120363143030407637@g.us',
    '120363029538805156@g.us',
    '120363049713481319@g.us'
 ];
 const restritos = [
    '120363039621149962@g.us', 
    '5521992884522-1634652354@g.us',
    '120363045569895184@g.us',
    '120363143030407637@g.us',
    '120363029538805156@g.us',
    '120363049713481319@g.us',
    '@g.us'
 ];

    const horarios = [
        7,10,14,19,21
    ];

    client.on('qr', qr => {
        qrcode.generate(qr, {small: true});
    });

    client.initialize();

    client.on('ready', async () => {
        console.log('E lá vamos nós!');
        await main;
    });

    let isMainInitialized = false;

    async function main() {
        if (isMainInitialized) {
            console.log('O fluxo principal já foi iniciado. Ignorando...');
            return;
        }
    
        isMainInitialized = true;
    
        try {
            console.log('Iniciando o fluxo principal...');

            fluxoprincipal();
            anunciosprogramados();
            clientecatalogo();

            console.log('Fluxo principal iniciado com sucesso!'); 
        }catch(error){
            console.error('Erro ao iniciar o fluxo principal!', error);
        }
    };

    function saudacao() {
        const data = new Date();
        let hora = data.getHours();
        let str = '';
        if (hora >= 6 && hora < 12) {
            str = '*Bom dia!*';
        } else if (hora >= 12 && hora < 18) {
            str = '*Boa tarde!*';
        } else {
            str = '*Boa noite!*';
        }
        return str;
    };
    function isFeriado() {
        const hoje = new Date();
        const dataAtual = `${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
        return feriados.includes(dataAtual);
    };
    
    function atendente() {
        const data = new Date();
        let hora = data.getHours();
        let strdois = '';
    
        if (isFeriado()) {
            strdois = '🏖️ *Aproveite o Feriado*\n\n😃 Assim que retornarmos em nossas atividades, um de nossos atendentes irá falar com você.\n\n🕖 _Nosso horário é de segunda a sábado de 08:00hs às 20:00hs._';
        } else if (hora >= 8 && hora < 20) {
            strdois = '😃 Aguarde um momento que logo será atendido.';
        } else {
            strdois = 'Humm... \n😒 Já estamos fora do horário de atendimento.\n\n😃 Mas não se preocupe, retornaremos assim que possível!\n\n🕖 _Nosso horário é de segunda a sábado de 08:00hs às 20:00hs._';
        }
    
        return strdois;
    }
    function domingo() {
        const data = new Date();
        let dia = data.getDay();
        let strtres = '';
        if (dia === 0) {
            strtres = '🏖️ *Aproveite o fim de semana!*\n\n😃 Assim que retornarmos em nossas atividades, um de nossos atendentes irá falar com você.\n\n🕖 _Nosso horário é de segunda a sábado de 08:00hs às 20:00hs._';
        } else {
            strtres = atendente();
            }
        return strtres;
        };

        const delay = ms => new Promise (res => setTimeout(res,ms))
        async function fimatendimento(chat) {
            await chat.sendMessage('*😉 Nosso atendimento está finalizado!*');
            
        }

        const state = {};

        async function fluxoprincipal(){
            client.on ('message', async msg => {
                if (msg.isGroup ||
                    restritos.some (id => id === '@g.us' ? msg.from.endsWith('@g.us'): id === msg.from)) {
                        return;
                    }
        const models = [ 'Versatile', 'Vigneto', 'Sicilia', 'Venezia', 'Toscana', 'Vita', 'Nuvole', 'Firenze', 'Eleganza', 'Sofisticato'];
        const from = msg.from;
        const mensagem = msg.body || msg.from.endsWith('@c.us');
        const contact = await msg.getContact();
        const chat = await msg.getChat();
        const audio = MessageMedia.fromFilePath('./audio_vitor.mp3');
        const name = contact.pushname;
        const MAX_ATTEMPTS = 3;
        if (!state [from]) state[from] = { attempts: 0, step: 0 };
        const userState = state[from];

        const saudacoes = ['oi', 'bom dia', 'boa tarde', 'olá', 'Olá', 'Oi', 'Boa noite', 'Bom Dia', 'Bom dia', 'Boa Tarde', 'Boa tarde', 'Boa Noite', 'boa noite'];
        if (userState.step === 0) {
            if (saudacoes.some(palavra => msg.body.includes(palavra)) && !models.some(txmodel => msg.body.includes(txmodel))) {
                state.step = "mainMenu";
                const logo = MessageMedia.fromFilePath('./logo.jpg');
                await delay(3000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, logo, {caption: '*🙋‍♂️ Olá* '+ name.split(" ")[0] + '! ' + saudacao() + '\n\n*Sou o Vitor, assistente virtual da La Vita Planejados!*\n_Como posso ajudar?_\n\n➡️ Por favor, digite o *NÚMERO* de uma das opções abaixo:\n\n1️⃣ - Realizar projeto\n2️⃣ - Catálogos\n3️⃣ - Assistência técnica\n4️⃣ - Acompanhar entrega\n5️⃣ - Outros assuntos'});
                state[from] = {step: 1};
                return;
        }
    }else if (userState.step === 1){
        switch(mensagem){
            case "1":
                await delay(3000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, '*😃Maravilha!*\n\nEsta é sua primeira experiência com planejados?\n\n#️⃣ - *SIM*\n0️⃣ - *NÃO*');
                state[from] = {step:2};
                return;
            case "2":
                await delay(3000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, '*😃 Maravilha* '+ name.split(" ")[0] + '!\n\nVocê fez uma excelente escolha!\nNós criamos um catálogo com projetos prontos de cozinha usando como base a maioria das plantas dos empreendimentos de hoje em dia.');
                await delay(3000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, '😎 São vários modelos incríveis para você escolher o que mais combina com seu apê!\n\n🥳 E os preços irão te surpreender.');

                await delay (3000);
                await chat.sendStateTyping();
                await delay (3000);
                await client.sendMessage(msg.from, '😉 Eu vou encaminhar o link do nosso catálogo abaixo para você conferir.\n\n➡️ Caso se interesse por algum é só clicar em *SAIBA MAIS* em nosso catálogo que estarei te esperando para lhe orientar nos próximos passos.\n\nhttps://lavitaplanejados.wixsite.com/catalogos');

                await delay(3000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, '*👋 Até logo!*');

                await delay(200000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, '🙋‍♂️ Olá ' + name.split(" ")[0] + ', sou eu aqui de novo!');

                await delay(3000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, 'O que achou do nosso catálogo?');
        
                await delay(3000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, '😉 Caso não encontrou o que procura, podemos fazer um *projeto personalizado* para você.\n\n*Gostaria de falar com um atendente?*\n\n#️⃣ - *SIM*\n0️⃣ - *NÃO*');
                state[from] = {step: 6};
                break;
        case "3":
                await delay(3000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, '*😃 Perfeito, logo um de nossos atendentes dará continuidade para lhe auxiliar em sua assistência técnica.*\n\n➡️ Enquanto isso pode ficar à vontade para decrever o problema apresentado.\n\n➡️ Caso consiga nos enviar fotos ou vídeos, ficamos gratos, pois irá nos auxiliar a entender melhor o ocorrido.');
                await delay(3000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, domingo());
                state [from] = {step:7};
                return;
        case "4":
                await delay(3000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, '😉 Você já está muito perto de ver seu sonho realizado.\n\n*Logo um de nossos atendentes dará continuidade ao seu atendimento.*');
                await delay(3000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, domingo());
                state [from] = {step:7};
                return;
        case "5":
                await delay(3000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, '*😃 Não tem problema, logo um de nossos atendentes dará continuidade ao seu atendimento.*\n\n➡️ Caso ainda não conheça nosso instagram, irei deixar o *link abaixo* enquanto aguarda o seu atendimento. 👇');
                await delay(3000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, 'https://www.instagram.com/la_vita_planejados?igsh=b3VweXg2bHVxYm50&utm_source=qr');
                await delay(3000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, domingo());
                state [from] = {step:7};
                return;

                default:
                    if (userState.attempts === undefined) userState.attempts = 0;
                    userState.attempts++;
                    const tentativasRestantes = MAX_ATTEMPTS - userState.attempts;
                    if (userState.attempts >= MAX_ATTEMPTS) {
                        await client.sendMessage(
                            msg.from,
                            '❌ *Número de tentativas excedido!*\nAtendimento finalizado!\n\nDigite *Oi* para iniciar.'
                        );
                        state[from] = { step: 0, attempts: 0 };
                        delete state[from]; 
                    } else {
                        await client.sendMessage(
                            msg.from,
                            `❌ *Opção inválida!*\nVocê tem mais ${tentativasRestantes} tentativa(s).`
                        );
                    }
                    return;


        }

    }else if (userState.step === 2){
        switch(mensagem){
            case "#":
                await delay(3000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, '*😉 Sem Problemas!*\n_Estamos aqui para te ajudar!_\n\n➡️ Para que entenda melhor o processo de compra em *Móveis Planejados*, irei te enviar um áudio.');
                await delay(3000);
                await chat.sendStateRecording();
                await delay(10000);
                await client.sendMessage(msg.from, audio, {sendAudioAsVoice: true});
                await delay(90000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, 'Agora que entendeu como funciona o processo de compra em *Móveis Planejados*.\n\nVocê teria como nos enviar plantas ou alguma imagem do ambiente?\n\n#️⃣ - *SIM*\n0️⃣ - *NÃO*');
                state[from] = {step: 3};
                return;
            case "0":
                await delay(3000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, '*😉 Maravilha!*\n_Que bom estar conhecendo nossa empresa!_\n\n➡️ Para que entenda melhor o processo de compra na *La Vita Planejados*, irei te enviar um áudio.');
                await delay(3000);
                await chat.sendStateRecording();
                await delay(10000);
                await client.sendMessage(msg.from, audio, {messageAsvoice: true});
                await delay(90000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, 'Agora que entendeu como funciona o processo de compra na nossa empresa.\n\nVocê teria como nos enviar plantas ou alguma imagem do ambiente?\n\n#️⃣ - *SIM*\n0️⃣ - *NÃO*');
                state[from] = {step: 3};
                return;
                default:
                    if (userState.attempts === undefined) userState.attempts = 0;
                    userState.attempts++;
                    const tentativasRestantes = MAX_ATTEMPTS - userState.attempts;
                    if (userState.attempts >= MAX_ATTEMPTS) {
                        await client.sendMessage(
                            msg.from,
                            '❌ *Número de tentativas excedido!*\nAtendimento finalizado!\n\nDigite *Oi* para iniciar.'
                        );
                        state[from] = { step: 0, attempts: 0 };
                        delete state[from]; 
                    } else {
                        await client.sendMessage(
                            msg.from,
                            `❌ *Opção inválida!*\nVocê tem mais ${tentativasRestantes} tentativa(s).`
                        );
                    }
                    return;
        }

    }else if(userState.step === 3){
        switch(mensagem){
            case "#":
                await delay(3000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, '😃 *Perfeito!*\n\nVou aguardar o envio das imagens que possuir para continuar com o seu atendimento.\n\nVocê pode enviar fotos, vídeos ou documento PDF.');
                await delay(3000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, 'Estou aguardando 😉');
                state[from] = {step: 4};
                return;
            case "0":
                await delay(3000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, '😉 *Não tem problema!*\n\nVamos continuar com o seu atendimento.');
                await delay(3000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, 'Irei lhe direcionar para um de nossos atendentes.');
                await delay(3000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, 'Enquanto aguarda o seu atendimento, vou te encaminhar o link do nosso instagram para que conheça um pouco sobre o nosso trabalho.\n\n\https://www.instagram.com/la_vita_planejados?igsh=b3VweXg2bHVxYm50&utm_source=qr');
                await delay(3000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, domingo());
                state [from] = {step:7};
                return;
                default:
                    if (userState.attempts === undefined) userState.attempts = 0;
                    userState.attempts++;
                    const tentativasRestantes = MAX_ATTEMPTS - userState.attempts;
                    if (userState.attempts >= MAX_ATTEMPTS) {
                        await client.sendMessage(
                            msg.from,
                            '❌ *Número de tentativas excedido!*\nAtendimento finalizado!\n\nDigite *Oi* para iniciar.'
                        );
                        state[from] = { step: 0, attempts: 0 };
                        delete state[from]; 
                    } else {
                        await client.sendMessage(
                            msg.from,
                            `❌ *Opção inválida!*\nVocê tem mais ${tentativasRestantes} tentativa(s).`
                        );
                    }
                    return;

        }
    }else if(userState.step === 4){
        if(msg.hasMedia && (msg.type === 'image' || msg.type === 'document' || msg.type === 'video') && msg.from.endsWith('@c.us')){
            await delay(3000);
            await chat.sendStateTyping();
            await delay(3000);
            await client.sendMessage(msg.from, '😃 *Excelente!*\n\nAlém deste arquivo que nos forneceu, você gostaria de enviar outro?\n\n#️⃣ - *SIM*\n0️⃣ - *NÃO*');
            state[from] = {step: 5};
            return;
            
        }else {
            if (userState.attempts === undefined) userState.attempts = 0;
            userState.attempts++;
            const tentativasRestantes = MAX_ATTEMPTS - userState.attempts;
            if (userState.attempts >= MAX_ATTEMPTS) {
                await client.sendMessage(
                    msg.from,
                    '❌ *Número de tentativas excedido!*\nAtendimento finalizado!\n\nDigite *Oi* para iniciar.'
                );
                state[from] = { step: 0, attempts: 0 }; 
                delete state[from];
            } else {
                await client.sendMessage(
                    msg.from,
                    `❌ *Este não é um arquivo válido!*\nVocê tem mais ${tentativasRestantes} tentativa(s).`
                );
            }
        return;
        }
    }else if(userState.step === 5){
        switch(mensagem){
            case "#":
                await delay(3000);
                await chat.sendStateTyping();
                await delay(3000); 
                await client.sendMessage(msg.from, '😃 *Perfeito!*\n\nVou aguardar.');
                state[from] = {step: 4};
                break;
            case "0":
                await delay(3000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, '😉 *Não tem problema!*\n\nVamos continuar com o seu atendimento.');
                await delay(3000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, 'Irei lhe direcionar para um de nossos atendentes.');
                await delay(3000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, 'Enquanto aguarda o seu atendimento, vou te encaminhar o link do nosso instagram para que conheça um pouco sobre o nosso trabalho.\n\n\https://www.instagram.com/la_vita_planejados?igsh=b3VweXg2bHVxYm50&utm_source=qr');
                await delay(3000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, domingo());
                state [from] = {step:7};
                return;
                default:
                    if (userState.attempts === undefined) userState.attempts = 0;
                    userState.attempts++;
                    const tentativasRestantes = MAX_ATTEMPTS - userState.attempts;
                    if (userState.attempts >= MAX_ATTEMPTS) {
                        await client.sendMessage(
                            msg.from,
                            '❌ *Número de tentativas excedido!*\nAtendimento finalizado!\n\nDigite *Oi* para iniciar.'
                        );
                        state[from] = { step: 0, attempts: 0 };
                        delete state[from]; 
                    } else {
                        await client.sendMessage(
                            msg.from,
                            `❌ *Opção inválida!*\nVocê tem mais ${tentativasRestantes} tentativa(s).`
                        );
                    }
                    return;    

        }
    }else if(userState.step === 6){
        switch(mensagem){
            case "#":
                await delay(3000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, domingo());
                state [from] = {step:7};
                break;
            case "0":
                await delay(3000);
                await chat.sendStateTyping();
                await delay(3000);
                await client.sendMessage(msg.from, '😉 *Sem problemas!*\n\nAté a próxima!');
                delete state[from];
                break;
                default:
                    if (userState.attempts === undefined) userState.attempts = 0;
                    userState.attempts++;
                    const tentativasRestantes = MAX_ATTEMPTS - userState.attempts;
                    if (userState.attempts >= MAX_ATTEMPTS) {
                        await client.sendMessage(
                            msg.from,
                            '❌ *Número de tentativas excedido!*\nAtendimento finalizado!\n\nDigite *Oi* para iniciar.'
                        );
                        state[from] = { step: 0, attempts: 0 };
                        delete state[from]; 
                    } else {
                        await client.sendMessage(
                            msg.from,
                            `❌ *Opção inválida!*\nVocê tem mais ${tentativasRestantes} tentativa(s).`
                        );
                    }
                    return;    
        }
    }else if (userState.step === 7){
        if (saudacoes.some(texto => mensagem.includes(texto))){
            await delay(1800000);
            delete state[from];
            return;
        }else {
            await delay(1800000);
            delete state[from];
            return;
        }
    }



       
            })
        };
        


        let condicaoanuncios = false;

        function anunciosprogramados () {
            if (condicaoanuncios) {
                console.log ('Tarefa de anúncios já agendadas');
                return;
            }
    
         condicaoanuncios = true;
         
         let mensagensEnviadas = new Set();
         cron.schedule('0 * * * *', async () => {
            const agora = new Date();
            const horaAtual = agora.getHours();
            const diaAtual = agora.getDay();
    
            if (diaAtual >= 1 && diaAtual <= 6 && horarios.includes(horaAtual)) {
                
                const chaveEnvio = `${diaAtual}-${horaAtual}`;
                if (mensagensEnviadas.has(chaveEnvio)){
                    return;
                }
    
                mensagensEnviadas.add(chaveEnvio);
    
                const imagens = [
                    './diaum.jpg',
                    './diadois.jpg',
                    './diatres.jpg',
                    './diaquatro.jpg',
                    'diacinco.jpg',
                    'diaseis.jpg'
                ];
    
                const caminhoImagem = imagens[diaAtual - 1];
    
                if (!fs.existsSync(caminhoImagem)) {
                    console.log(`Arquivo de imagem não encontrado ${caminhoImagem}`);
                    return;
                }
                const anuncio = MessageMedia.fromFilePath(caminhoImagem);
                const mensagem = 'Saiba mais clicando no link abaixo 👇\nhttps://wa.me/message/VJJVS66FP3CTI1';
    
                for (const grupo of grupos) {
                    try{
                    await client.sendMessage(grupo, anuncio, {caption: mensagem});
                    console.log(`Mensagem enviada para o grupo, ${grupo}`);
                    }catch (error) {
                        console.log(`Erro ao enviar mensagem para o grupo, ${grupo}`, error);
                    }
                }
    
    
            }
    
    
         });
        };

        let modeloscatalogos = false;
        function clientecatalogo(){
            if(modeloscatalogos){
            console.log('Bot seguindo o fluxo normal...');
            return;
        }

        modeloscatalogos = true;
        client.on('message', async msg => {
            if(msg.isGroup || restritos.some(id => id === '@g.us' ? msg.from.endsWith('@g.us'): id===msg.from)){
                return;
            }
        const modelos = [ 'Versatile', 'Vigneto', 'Sicilia', 'Venezia', 'Toscana', 'Vita', 'Nuvole', 'Firenze', 'Eleganza', 'Sofisticato'];
        const chat = await msg.getChat();
        const contato = await msg.getContact();
        const name = await contato.pushname;
        const mdltexto = msg.body || msg.from.endsWith('@c.us');

        if (modelos.some(modelo => msg.body.includes(modelo))){
            await delay (3000);
            await chat.sendStateTyping();
            await delay(3000);
            await client.sendMessage(msg.from, '*😃 Que bom você ter voltado* '+ name.split(" ")[0] + '!\n\nFez uma excelente escolha, este modelo vai ficar lindo na sua cozinha.\n\n*Parabéns!🥳*');
            await delay (3000);
            await chat.sendStateTyping();
            await delay(3000);
            await client.sendMessage(msg.from, '➡️ Será necessário uma visita técnica ao local para a conferência das medidas\n\n➡️ Caso tenha a planta e fotos do local pode nos encaminhar pois irá ajudar no seu atendimento.');
            await delay (3000);
            await chat.sendStateTyping();
            await delay(3000);
            await client.sendMessage(msg.from, '*😃 Logo um de nossos atendentes irá falar com você pra te guiar nos próximos passos.*');
            await delay (3000);
            await chat.sendStateTyping();
            await delay(3000);
            await client.sendMessage(msg.from, domingo());

        }
            

        });

    }; 

        
        main();
