import { httpService } from "./http.service"
import { utilService } from "./utilService"

const KEY = 'board/'

export default {
    query,
    getBoardById,
    deleteBoard,
    saveBoard,
    getEmptyBoard,
    getEmptyCard,
    updateCard,
    updateBoard,
    getCloudImages,
    getEmptyTask,
}

const cloudUrls = [
    'https://res.cloudinary.com/dtu0lzwpw/image/upload/v1621015877/taskman/jared-verdi-PNKwdJ8WetM-unsplash_aabpzg.jpg',
    'https://res.cloudinary.com/dtu0lzwpw/image/upload/v1621016569/taskman/zsofia-szalay-TbrzJbcacnQ-unsplash_bst628.jpg',
    'https://res.cloudinary.com/dtu0lzwpw/image/upload/v1621016567/taskman/the-nigmatic-lUnLaEWzcz8-unsplash_vcfxju.jpg',
    'https://res.cloudinary.com/dtu0lzwpw/image/upload/v1621016565/taskman/steve-johnson-274PPmlOjyQ-unsplash_twaarr.jpg',
    'https://res.cloudinary.com/dtu0lzwpw/image/upload/v1621016564/taskman/omer-salom-LoijtQXXNhs-unsplash_w6cs4h.jpg',
    'https://res.cloudinary.com/dtu0lzwpw/image/upload/v1621016564/taskman/jonny-gios-h_XcnLbDc_0-unsplash_lhi5si.jpg',
    'https://res.cloudinary.com/dtu0lzwpw/image/upload/v1621016564/taskman/inaki-del-olmo-IRCzpl2YYKE-unsplash_tpzeyw.jpg',
    'https://res.cloudinary.com/dtu0lzwpw/image/upload/v1621016564/taskman/joel-holland-TRhGEGdw-YY-unsplash_dqapzs.jpg',
    'https://res.cloudinary.com/dtu0lzwpw/image/upload/v1621016558/taskman/ian-schneider-TamMbr4okv4-unsplash_r85bnj.jpg',
    'https://res.cloudinary.com/dtu0lzwpw/image/upload/v1621016557/taskman/mohammad-alizade-CDu0x1Aiils-unsplash_jqizxr.jpg',
    'https://res.cloudinary.com/dtu0lzwpw/image/upload/v1621016556/taskman/mohammad-alizade-62t_kKa2YlA-unsplash_rbytvb.jpg',
    'https://res.cloudinary.com/dtu0lzwpw/image/upload/v1621016555/taskman/mohamed-rishfaan-ir_65wcK_DA-unsplash_qgfljs.jpg',
    'https://res.cloudinary.com/dtu0lzwpw/image/upload/v1621016554/taskman/ines-mills-TGs0tHMk4eg-unsplash_bkqpbf.jpg',
    'https://res.cloudinary.com/dtu0lzwpw/image/upload/v1621016551/taskman/erol-ahmed-aIYFR0vbADk-unsplash_g8hmym.jpg',
    'https://res.cloudinary.com/dtu0lzwpw/image/upload/v1621016551/taskman/duy-thanh-nguyen-ZeoSVUcWjfY-unsplash_z4qs2l.jpg',
    'https://res.cloudinary.com/dtu0lzwpw/image/upload/v1621016550/taskman/fransiskus-filbert-mangundap-C9hqYikX34w-unsplash_mqj9zi.jpg',
    'https://res.cloudinary.com/dtu0lzwpw/image/upload/v1621016548/taskman/arpad-spodni-KbKQY_LjmuE-unsplash_fqlcyv.jpg',
    'https://res.cloudinary.com/dtu0lzwpw/image/upload/v1621016546/taskman/dave-hoefler-PkQH-GHEp0A-unsplash_jfurlc.jpg',
    'https://res.cloudinary.com/dtu0lzwpw/image/upload/v1621016544/taskman/fabrice-villard-Du41jIaI5Ww-unsplash_kqcna2.jpg',
    'https://res.cloudinary.com/dtu0lzwpw/image/upload/v1621016542/taskman/estee-janssens-aQfhbxailCs-unsplash_slddqg.jpg',
    'https://res.cloudinary.com/dtu0lzwpw/image/upload/v1621016542/taskman/angel-luciano-XQJ0BBSvTs0-unsplash_d7advt.jpg',
    'https://res.cloudinary.com/dtu0lzwpw/image/upload/v1621016538/taskman/callum-wale-V8j3F6Ik9_s-unsplash_clbkte.jpg',
    'https://res.cloudinary.com/dtu0lzwpw/image/upload/v1621016537/taskman/braden-jarvis-prSogOoFmkw-unsplash_sgtmnd.jpg',
    'https://res.cloudinary.com/dtu0lzwpw/image/upload/v1621016534/taskman/danielle-macinnes-IuLgi9PWETU-unsplash_u9xmg7.jpg',
    'https://res.cloudinary.com/dtu0lzwpw/image/upload/v1621016533/taskman/carolyn-christine-D7bmnvGJA2Q-unsplash_oz27jz.jpg',
    'https://res.cloudinary.com/dtu0lzwpw/image/upload/v1621018122/taskman/vlad-kutepov-WYJ9c7uSdnU-unsplash_c2g6gy.jpg',
]

// CRUDL
async function query() {
    try {
        return await httpService.get(KEY)
    } catch (err) {
        console.log('err:', err)
    }
}

async function getBoardById(id) {
    try {
        return await httpService.get(KEY + id)
    } catch (err) {
        console.log('err:', err)
    }
}

async function deleteBoard(id) {
    try {
        return await httpService.delete(KEY + id)
    } catch (err) {
        console.log('Error from boardService - ', err);
    }
}

async function saveBoard(board) {
    try {
        if (board._id) return await httpService.put(KEY + board._id, board)
        return await httpService.post(KEY, board)
    } catch (err) {
        console.log('err:', err)
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function updateCard(taskToUpdate, cardToUpdate, boardToUpdate) {
    // if you want to delete a task use the func and send the idx ----updateBoard(idx)----
    if (typeof (taskToUpdate) !== 'number') {
        const taskIdx = cardToUpdate.tasks.findIndex(t => t._id === taskToUpdate._id)
        cardToUpdate.tasks.splice(taskIdx, 1, taskToUpdate)
    } else {
        cardToUpdate.tasks.splice(taskToUpdate, 1)
    }
    return updateBoard(cardToUpdate, boardToUpdate)
}

function updateBoard(cardToUpdate, boardToUpdate) {
    if (typeof (cardToUpdate) !== 'number') {
        const cardIdx = boardToUpdate.cards.findIndex(card => card._id === cardToUpdate._id)
        boardToUpdate.cards.splice(cardIdx, 1, cardToUpdate)
    } else {
        boardToUpdate.cards.splice(cardToUpdate, 1)
    }
    const updatedBoard = { ...boardToUpdate, cards: [...boardToUpdate.cards] }
    return updatedBoard;
}

// get functions /////////////////////////////////////////////////////////////////////////////////////////////////

function getCloudImages() {
    return cloudUrls;
}

function getEmptyBoard() {
    return {
        title: '',
        members: [],
        cards: [{ _id: utilService.makeId(), title: 'Your first card!', tasks: [] }],
        activity: [],
        background: [],
        labels: [],
    }
}

function getEmptyCard() {
    return {
        _id: utilService.makeId(),
        title: '',
        tasks: []
    }
}

function getEmptyTask() {
    return {
        _id: utilService.makeId(),
        title: '',
        desc: null,
        createdAt: Date.now(),
        labels: [],
        dueDate: '',
        activity: [],
        members: [],
        isWithAttachment: false,
        cover: 'white',
        checklists: [],
        doneAt: null
    }
}