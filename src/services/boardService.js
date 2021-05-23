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
    getActivities,
    getUsers
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

const gBoards = [
    {
        '_id': 'b101',
        'title': 'First board',
        'labels': [{ 'desc': 'Copy Request', 'color': '#61bd4f' }, { 'desc': 'One more step', 'color': '#f2d600' }, { 'desc': 'Design Team', 'color': '#ff9f1a' }, { 'desc': 'Product Marketing', 'color': '#eb5a46' }, { 'desc': 'Trello Tip', 'color': '#c377e0' }, { 'desc': 'Help', 'color': '#0079bf' }, { 'desc': 'Priority', 'color': '#51e898' }],
        'members': [{ '_id': 'm101', 'name': 'Aviv Zohar' }, { '_id': 'm102', 'name': 'Hadar Marom' }, { '_id': 'm103', 'name': 'Oshri Yoktan' }],
        'activity': [],
        'background': '',
        'cards': [
            {
                '_id': 'c101',
                'title': 'Do this',
                'tasks': [
                    {
                        '_id': 't101',
                        'title': 'app',
                        'desc': null,
                        'createdAt': Date.now(),
                        'labels': [],
                        'dueDate': '',
                        'activity': [],
                        'members': [],
                        'isWithAttachment': false,
                        'cover': 'white',
                        'checklists': [],
                        'doneAt': null
                    },
                    {
                        '_id': 't102',
                        'title': 'css',
                        'desc': null,
                        'createdAt': Date.now(),
                        'labels': [],
                        'dueDate': '',
                        'activity': [],
                        'members': [],
                        'isWithAttachment': false,
                        'cover': 'white',
                        'checklists': [],
                        'doneAt': null
                    },
                    {
                        '_id': 't103',
                        'title': 'css',
                        'desc': null,
                        'createdAt': Date.now(),
                        'labels': [],
                        'dueDate': '',
                        'activity': [],
                        'members': [],
                        'isWithAttachment': false,
                        'cover': 'white',
                        'checklists': [],
                        'doneAt': null
                    },
                    {
                        '_id': 't104',
                        'title': 'css',
                        'desc': null,
                        'createdAt': Date.now(),
                        'labels': [],
                        'dueDate': '',
                        'activity': [],
                        'members': [],
                        'isWithAttachment': false,
                        'cover': 'white',
                        'checklists': [],
                        'doneAt': null
                    },
                    {
                        '_id': 't105',
                        'title': 'css',
                        'desc': null,
                        'createdAt': Date.now(),
                        'labels': [],
                        'dueDate': '',
                        'activity': [],
                        'members': [],
                        'isWithAttachment': false,
                        'cover': 'white',
                        'checklists': [],
                        'doneAt': null
                    },
                ],
            },
            {
                '_id': 'c102',
                'title': 'checklist',
                'tasks': [
                    {
                        '_id': 't103',
                        'title': 'learn react',
                        'desc': null,
                        'createdAt': Date.now(),
                        'labels': [],
                        'dueDate': '',
                        'activity': [],
                        'members': [],
                        'isWithAttachment': false,
                        'cover': 'white',
                        'checklists': [],
                        'doneAt': null
                    },
                    {
                        '_id': 't104',
                        'title': 'learn angular',
                        'desc': null,
                        'createdAt': Date.now(),
                        'labels': [],
                        'dueDate': '',
                        'activity': [],
                        'members': [],
                        'isWithAttachment': false,
                        'cover': 'white',
                        'checklists': [],
                        'doneAt': null
                    },
                ],
            },
            {
                '_id': 'c103',
                'title': 'done',
                'tasks': [
                    {
                        '_id': 't105',
                        'title': 'bootcamp',
                        'desc': null,
                        'createdAt': Date.now(),
                        'labels': [],
                        'dueDate': '',
                        'activity': [],
                        'members': [],
                        'isWithAttachment': false,
                        'cover': 'white',
                        'checklists': [],
                        'doneAt': null
                    },
                    {
                        '_id': 't106',
                        'title': 'school',
                        'desc': null,
                        'createdAt': Date.now(),
                        'labels': [],
                        'dueDate': '',
                        'activity': [],
                        'members': [],
                        'isWithAttachment': false,
                        'cover': 'white',
                        'checklists': [],
                        'doneAt': null
                    },
                ],
            },
            {
                '_id': 'c104',
                'title': 'AI',
                'tasks': [
                    {
                        '_id': 't107',
                        'title': 'app',
                        'desc': null,
                        'createdAt': Date.now(),
                        'labels': [],
                        'dueDate': '',
                        'activity': [],
                        'members': [],
                        'isWithAttachment': false,
                        'cover': 'white',
                        'checklists': [],
                        'doneAt': null
                    },
                    {
                        '_id': 't108',
                        'title': 'css',
                        'desc': null,
                        'createdAt': Date.now(),
                        'labels': [],
                        'dueDate': '',
                        'activity': [],
                        'members': [],
                        'isWithAttachment': false,
                        'cover': 'white',
                        'checklists': [],
                        'doneAt': null
                    },
                ],
            },
            {
                '_id': 'c105',
                'title': 'Chikchukim',
                'tasks': [
                    {
                        '_id': 't109',
                        'title': 'learn react',
                        'desc': null,
                        'createdAt': Date.now(),
                        'labels': [],
                        'dueDate': '',
                        'activity': [],
                        'members': [],
                        'isWithAttachment': false,
                        'cover': 'white',
                        'checklists': [],
                        'doneAt': null
                    },
                    {
                        '_id': 't110',
                        'title': 'learn angular',
                        'desc': null,
                        'createdAt': Date.now(),
                        'labels': [],
                        'dueDate': '',
                        'activity': [],
                        'members': [],
                        'isWithAttachment': false,
                        'cover': 'white',
                        'checklists': [],
                        'doneAt': null
                    },
                ],
            },
            {
                '_id': 'c106',
                'title': 'finalll',
                'tasks': [
                    {
                        '_id': 't111',
                        'title': 'bootcamp',
                        'desc': null,
                        'createdAt': Date.now(),
                        'labels': [],
                        'dueDate': '',
                        'activity': [],
                        'members': [],
                        'isWithAttachment': false,
                        'cover': 'white',
                        'checklists': [],
                        'doneAt': null
                    },
                    {
                        '_id': 't112',
                        'title': 'school',
                        'desc': null,
                        'createdAt': Date.now(),
                        'labels': [],
                        'dueDate': '',
                        'activity': [],
                        'members': [],
                        'isWithAttachment': false,
                        'cover': 'white',
                        'checklists': [],
                        'doneAt': null
                    },
                ],
            },
        ],
    },
    {
        '_id': 'b102',
        'title': 'Second board',
        'labels': [{ 'desc': 'Copy Request', 'color': '#61bd4f' }, { 'desc': 'One more step', 'color': '#f2d600' }, { 'desc': 'Design Team', 'color': '#ff9f1a' }, { 'desc': 'Product Marketing', 'color': '#eb5a46' }, { 'desc': 'Trello Tip', 'color': '#c377e0' }, { 'desc': 'Halp', 'color': '#0079bf' }, { 'desc': 'Priority', 'color': '#51e898' }],
        'members': [],
        'activity': [],
        'backgroundColor': '',
        'backgroundImg': '',
        'cards': [
            {
                '_id': 'c107',
                'title': 'To Fix',
                'tasks': [
                    {
                        '_id': 't113',
                        'title': 'app2',
                        'desc': null,
                        'createdAt': Date.now(),
                        'labels': [],
                        'dueDate': '',
                        'activity': [],
                        'members': [],
                        'isWithAttachment': false,
                        'cover': 'white',
                        'checklists': [],
                        'doneAt': null
                    },
                    {
                        '_id': 't114',
                        'title': 'jsx',
                        'desc': null,
                        'createdAt': Date.now(),
                        'labels': [],
                        'dueDate': '',
                        'activity': [],
                        'members': [],
                        'isWithAttachment': false,
                        'cover': 'white',
                        'checklists': [],
                        'doneAt': null
                    },
                ],
            }
        ],
    },
]

const gUsers = [
    { _id: 'u101', name: 'Oshri Yoktan', boards: [5523] },
    { _id: 'u102', name: 'Hadar Marom', boards: [5522] },
    { _id: 'u103', name: 'Aviv Zohar', boards: [5523] },
]

const gActivities = [
    { _id: 'a101', member: 'Oshri Yoktan', type: 'added', desc: 'task', card: 'Do this', createdAt: Date.now() },
    { _id: 'a102', member: 'Hadar Marom', type: 'removed', desc: 'task', card: 'Checklist', createdAt: Date.now() },
    { _id: 'a103', member: 'Aviv Zohar', type: 'updated', desc: 'task', card: 'Done', createdAt: Date.now() },
]

// CRUDL
// saveBoard(gBoards[0])
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
        if (board._id || board._id === 0) return await httpService.put(KEY + board._id, board)
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
        desc: '',
        createdAt: Date.now(),
        labels: [],
        dueDate: '',
        activity: [],
        members: [],
        isWithAttachment: false,
        cover: 'white',
        checklists: [],
        doneAt: ''
    }
}

function getUsers() {
    return gUsers;
}

function getActivities() {
    return gActivities;
}

// comment /////////////////////////////////

// async function uploadImg(ev) {
//     // cloudinary.uploader.upload("sample.jpg", { "crop": "limit", "tags": "samples", "width": 3000, "height": 2000 }, function (result) { console.log(result) });
//     // cloudinary.image("sample", {"crop":"fill","gravity":"faces","width":300,"height":200,"format":"jpg"});
//     const UPLOAD_PRESET = '' // Insert yours
//     const CLOUD_NAME = '' // Insert yours
//     const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
//     const FORM_DATA = new FormData();
//     // Building the request body
//     FORM_DATA.append('file', ev.target.files[0])
//     FORM_DATA.append('upload_preset', UPLOAD_PRESET)
//     // Sending a post method request to Cloudniarys' API
//     try {
//         const res = await axios.post(UPLOAD_URL, FORM_DATA)
//         return res.data;
//     } catch (err) {
//         console.error('ERROR!', err)
//     }
// }