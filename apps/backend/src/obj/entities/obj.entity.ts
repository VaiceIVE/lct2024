import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { HeatPoint } from "./heatpoint.entity";
import { Event } from "../../prediction/entities/event.entity";
import { ObjResponse } from "../../response/entities/objResponse.entity";
import { ObjPrediction } from "../../prediction/entities/objPrediction.entity";

@Entity()
export class Obj {

    @PrimaryGeneratedColumn()
    id: number
    //9
    @Column({
        nullable: true,
        unique: true
    })
    unom: string

    @Column({
        nullable: true
    })
    address: string

    @Column({
        nullable: true
    })
    wallMaterial: string

    @Column({
        nullable: true
    })
    floorsAmount: number

    @Column('decimal', {
        precision: 8,
        scale: 1, 
        nullable: true
    })
    totalArea: number

    @Column({
        nullable: true
    })
    objType: string

    @Column({
        nullable: true
    })
    munOkr: string

    @Column({
        nullable: true
    })
    admOkr: string
    //svoi po 9
    @Column({
        nullable: true
    })
    socialType?: "education" | "medicine" | "mkd" | "prom"
    //14
    @Column({
        nullable: true
    })
    entranceAmount: number

    @Column({
        nullable: true
    })
    flatsAmount: number

    @Column({
        nullable: true
    })
    btuwear: number
    // po 7 all TP 
    @Column({
        nullable: true
    })
    geodata: string

    @Column({
        nullable: true
    })
    geoBoundaries: string

    @ManyToOne(() => HeatPoint, (heatPoint) => heatPoint.objects, {
        onDelete: "NO ACTION",
        cascade: ['insert', "update"]
    })
    @JoinTable()
    heatPoint: HeatPoint

    @OneToMany(() => ObjResponse, (objRes) => objRes.obj,{
        cascade: true
    })
    @JoinTable()
    objResponses: ObjResponse[]

    @OneToMany(() => ObjPrediction, (event) => event.object,{
        cascade: true
    })
    @JoinTable()
    objPredictions: ObjPrediction[]

    @BeforeInsert()
    @BeforeUpdate()
    updateSocialType()
    {
        if([
            "блок-пристройка начальных классов",
            "детсад-ясли",
            "детские ясли",
            "детский дом культуры",
            "детский корпус",
            "детский лечебный корпус",
            "детский сад",
            "детский санаторий",
            "детское дошкольное учреждение",
            "дом детского творчества",
            "дом ребенка",
            "интернат",
            "лицей",
            "приходская школа",
            "училище",
            "школа",
            "школа искусств",
            "школа спортивного мастерства",
            "школа студия",
            "школа-интернат",
            "школа-сад",
            "школьное",
            "школьное учреждение",
            "ясли",
            "ясли-сад",
            "гимназия"
            ].includes(this.objType))
            {
                this.socialType = "education"
            }
        else
        {
            if([
                "больница",
                "госпиталь",
                "детская поликлиника",
                "детская стоматологическая поликлиника",
                "детский корпус",
                "детский лечебный корпус",
                "детский санаторий",
                "диспансер",
                "диспансер противотуберкулезный",
                "кожно-венерологический диспансер",
                "лазарет",
                "лечебница",
                "лечебное",
                "лечебный корпус",
                "медицинский корпус",
                "медицинско-восстановительный центр",
                "медсанчасть",
                "неотложная медпомощь",
                "подстанция скорой помощи",
                "поликлиника",
                "родильный дом",
                "санаторий",
                "санаторий-профилакторий",
                "санитарное",
                "санчасть",
                "станция скорой помощи",
                "хирургический корпус"
            ].includes(this.objType))
                {
                    this.socialType = "medicine"
                }
            else
            {
                if([
                    "комплекс многофункциональный",
                    "переход подземный",
                    " спецназначение",
                    "станция общественного транспорта",
                    "фильтры",
                    "формовочный цех",
                    "фотолаборатория",
                    "химчистка",
                    "хладоцентр",
                    "хлебозавод",
                    "хлораторная",
                    "хозблок",
                    "трансформаторная подстанция",
                    "хозяйственная постройка",
                    "хозяйственный корпус",
                    "холодильная станция",
                    "холодильник",
                    "холодильный склад",
                    "храм",
                    "хранилище",
                    "хранилище пленки",
                    "хранилище рентгенопленки",
                    "центр обслуживания",
                    "церковь",
                    "здание религиозных собраний",
                    "автостоянка открытого типа",
                    "цех",
                    "цех бетоносмесительный",
                    "цех колбасный",
                    "цех кузнечный",
                    "цех нестанд.оборуд.",
                    "цех по ремонту",
                    "цех резки металла",
                    "цех сборочный",
                    "цех столярный",
                    "часовня",
                    "чебуречная",
                    "шахматно-шашечный павильон",
                    "штаб",
                    "экспедиция",
                    "элеватор",
                    "электрогруппа",
                    "электрокарная",
                    "электромонтажный цех",
                    "электроподстанция",
                    "электротяговая подстанция",
                    "электроцех",
                    "электрощитовая",
                    "энеpгоблок",
                    "энергокорпус",
                    "эрлифт",
                    "эстрада",
                    "труба дымовая",
                    "тепловой павильон",
                    "таможенный терминал",
                    "столовая и казарма",
                    "столовая и спортзал",
                    "столовая и учpеждение",
                    "столярная мастерская",
                    "сторожка",
                    "стоянка",
                    "стоянка машин,гараж",
                    "стрел.пост",
                    "строительный участок",
                    "стройцех",
                    "сушилка",
                    "сушильный цех",
                    "тарный корпус",
                    "творческие мастерские",
                    "театр",
                    "телеателье",
                    "телемеханический центр",
                    "теннисный корпус",
                    "теннисный корт",
                    "теплица",
                    "тепловой пункт",
                    "тепловой узел",
                    "теплостанция",
                    "теплоузел",
                    "тех.школа",
                    "техкорпус",
                    "техникум",
                    "техническое здание",
                    "техническое училище",
                    "типография",
                    "тир",
                    "торговое",
                    "торговое и бытовое",
                    "торговое и бытовое обслуживание",
                    "торговое и учреждение",
                    "торговый павильон",
                    "торговый центр",
                    "трансформаторная",
                    "трансформаторная и компрессорная",
                    "радиоузел",
                    "разгрузочная,транспортная",
                    "раздевалка",
                    "распределительная камера",
                    "распределительная подстанция",
                    "распределительный пункт",
                    "растворный узел",
                    "растворный узел и склад сыпучих материал",
                    "регулятор",
                    "ремонтная автомастерская",
                    "ремонтная зона",
                    "ремонтная мастерская",
                    "ремонтно-механический цех",
                    "ремонтные мастерские",
                    "ремонтный корпус",
                    "ремонтный цех",
                    "рентгенлаборатория",
                    "рентгеновский архив",
                    "ресторан",
                    "рубильное отделение",
                    "рынок",
                    "рынок кpытый",
                    "салон-парикмахерская",
                    "сарай",
                    "сауна",
                    "сбербанк",
                    "сварочная",
                    "сварочная мастерская",
                    "сварочная-кузница",
                    "сварочный цех",
                    "свинарник",
                    "свободн.",
                    "склад",
                    "спецпомещение",
                    "спецпомещение ГО",
                    "спецшкола",
                    "спорт.лыжн.база",
                    "спортзал",
                    "спортзал,столовая",
                    "спортивная школа",
                    "спортивно-бытовой",
                    "спортивно-оздоровительный комплекс",
                    "спортивно-тренировочный комплекс",
                    "спортивное",
                    "спортивный клуб",
                    "спортивный комплекс",
                    "спортивный корпус",
                    "спортивный павильон",
                    "справочная",
                    "стадион",
                    "станция мед.газа",
                    "станция нейтрализации",
                    "станция обезжелезования",
                    "станция перекачки",
                    "станция сжатых газов",
                    "станция скорой помощи",
                    "станция технического обслуживания",
                    "стол заказов",
                    "столовая",
                    "трибуна",
                    "троллейбусная станция",
                    "туалет",
                    "тяговая подстанция",
                    "уборная",
                    "умывальник",
                    "универмаг",
                    "универсам",
                    "университет",
                    "управление внутренних дел",
                    "учебно-воспитателный комбинат",
                    "учебно-воспитательное",
                    "учебно-лабораторное",
                    "учебно-лабораторный корпус",
                    "учебно-методический центр",
                    "учебно-научное",
                    "учебно-научное и учреждение",
                    "учебно-производственное",
                    "учебно-производственный комбинат",
                    "учебное",
                    "учебные мастерские",
                    "учебный комбинат",
                    "учебный корпус",
                    "учреждение",
                    "учреждение и гараж",
                    "учреждение и казарма",
                    "учреждение и котельная",
                    "учреждение и красный уголок",
                    "учреждение и общепит",
                    "учреждение и производство",
                    "учреждение и столовая",
                    "учреждение и торговое",
                    "учреждение,мастерские",
                    "учреждение,проходной пункт",
                    "учреждение-склад",
                    "ф-ка по пошиву и ремонту кожизделий",
                    "фабрика",
                    "фабрика-кухня",
                    "фабрика-прачечная",
                    "физкабинет",
                    "физкультурно-оздоровительный комплекс",
                    "прочее использование",
                    "прочее с производством",
                    "прочие",
                    "птичник",
                    "пункт охраны",
                    "прочее",
                    "обсерватория",
                    "очистные сооружения",
                    "промышленное",
                    "пропускной пункт",
                    "профилактический бокс",
                    "профилакторий",
                    "профилакторий для машин",
                    "профтехучилище",
                    "проходная",
                    "нежилое,ГПТУ",
                    "продуктовый магазин",
                    "произв.-бытовой корп.и гараж-стоянка",
                    "произв.подсобный корпус",
                    "производственная лаборатория",
                    "производственная мастерская",
                    "производственно-административное",
                    "производственно-административный",
                    "производственно-административный корпус",
                    "производственно-бытовой корпус",
                    "производственно-лабораторный корпус",
                    "производственно-складская",
                    "производственно-складское",
                    "производственное",
                    "склад ГСМ",
                    "склад баллонов",
                    "склад горючего",
                    "склад горючих веществ",
                    "склад запчастей",
                    "склад и ЦТП",
                    "склад и гараж",
                    "склад и магазин",
                    "склад и мастерская",
                    "склад и пищеблок",
                    "склад и производство",
                    "склад и торговое",
                    "склад и учреждение",
                    "склад кислорода",
                    "склад кислот и бойлерная",
                    "склад лакокрасок",
                    "склад материальный",
                    "склад металла",
                    "склад переработки",
                    "склад подземный",
                    "склад произв.",
                    "склад рентгенпленок",
                    "склад сырья",
                    "склад химреактивов",
                    "склад цемента",
                    "склад ядохимикатов",
                    "склад,компрессорная",
                    "склад,учреждение",
                    "склад-ангар",
                    "склад-навес",
                    "склад-овощехранилище",
                    "склад-производственное",
                    "складское",
                    "складское и производство",
                    "слесарная мастерская",
                    "сливная станция",
                    "служ.корпус",
                    "служебно-бытов.",
                    "служебное",
                    "смеситель",
                    "нежилое",
                    "общественное питание",
                    "общественный туалет",
                    "овощехранилище",
                    "овощи-фрукты",
                    "озонаторная",
                    "опорно-усилительная станция",
                    "опытно-производственный участок",
                    "оранжерея",
                    "отдел милиции",
                    "отделение милиции",
                    "отделение связи",
                    "отделение судебно-медицинской экспертизы",
                    "отстойник",
                    "офис",
                    "очистная башня",
                    "проходная будка",
                    "проходная и охрана",
                    "проходная контора",
                    "очистные сооружения ТИЦ (подземные)",
                    "павильон",
                    "павильон рынка",
                    "павильон хоккейно-конькобежный",
                    "парикмахерская",
                    "пекарня",
                    "пенообразователь",
                    "переходный пункт",
                    "пилорама",
                    "питомник",
                    "питомник для собак",
                    "пищеблок",
                    "плавательный бассейн",
                    "пленкохранилище",
                    "подсобное",
                    "подсобное помещение",
                    "подсобные цеха-мастерские",
                    "подсобный корпус",
                    "подстанция",
                    "подстанция скорой помощи",
                    "подстанция электросети",
                    "подтрибунные помещения",
                    "пожарная охрана",
                    "пожарная станция",
                    "пожарное депо",
                    "посольство",
                    "пост",
                    "пост диагностики",
                    "пост охраны",
                    "почта",
                    "почтамт",
                    "пошивочная мастерская",
                    "прачечная",
                    "прачечная детсада",
                    "предприятие",
                    "приемное отделение",
                    "приемный пункт",
                    "приемный пункт вторсырья",
                    "приемный пункт стеклопосуды",
                    "приточная камера",
                    "продбаза",
                    "продсклад",
                    "производственное здание",
                    "производственное и котельная",
                    "производственное,гараж,котельная",
                    "производственное,учреждение",
                    "производственные мастерские",
                    "производственный корпус",
                    "производственный корпус и склад",
                    "производственный цех",
                    "производство с административно-бытовым",
                    "переход надземный",
                    "котельная",
                    "мастерская и гараж",
                    "мастерская и склад",
                    "мастерская по ремонту автотранспорта",
                    "мастерская скульптора",
                    "мастерская столярная",
                    "мастерская художника",
                    "мастерская,склад",
                    "мастерские",
                    "мастерские ремонтные",
                    "мастерские-кузница",
                    "мастерские-производство",
                    "материально-технический склад",
                    "машинное отделение",
                    "медвытрезвитель",
                    "насосная",
                    "насосная станция",
                    "научно- исследовательское",
                    "научно-исслед.и административный корпус",
                    "научно-производственное",
                    "научно-технический корпус",
                    "научное",
                    "магазин",
                    "мазутная",
                    "мазутно-насосная",
                    "малярная",
                    "малярный цех",
                    "манеж",
                    "манеж конно-спортивный",
                    "маслоаппаратная",
                    "маслохранилище",
                    "мастер.по изгот",
                    "мастерская",
                    "мастерская гаража",
                    "механические мастерские",
                    "механический корпус",
                    "механический участок",
                    "механический цех",
                    "модуль",
                    "мойка",
                    "мойка автомашин",
                    "мойка для машин, гараж",
                    "мойка и авторемонтный цех",
                    "мойка и мастерская",
                    "мойка,весовая",
                    "мойка-гараж",
                    "молочная кухня",
                    "молочно-раздаточный пункт",
                    "морг",
                    "моторный цех",
                    "музей",
                    "навес",
                    "завод",
                    "завод-производство",
                    "заводоуправление",
                    "заготовительный цех",
                    "зал гражданских панихид",
                    "заправочный пункт",
                    "зарядная",
                    "зарядная станция",
                    "здание общественных организаций",
                    "игротека",
                    "изолятор",
                    "клуб и столовая",
                    "клуб столовая",
                    "книгохранилище",
                    "кожно-венерологический диспансер",
                    "колокольня-звонница",
                    "комбинат",
                    "комбинат бытового обслуживания",
                    "комбинат общественного питания",
                    "коммунально-бытовое",
                    "лукохранилище",
                    "лыжная база",
                    "котельная-прачечная",
                    "красильный цех",
                    "крестильная",
                    "кузница",
                    "культурно-просветительное",
                    "культурно-спортивный корпус",
                    "кухня",
                    "лаборатория",
                    "лабораторно-клинический корпус",
                    "лабораторно-производственный корпус",
                    "лабораторный корпус",
                    "лабораторный цех",
                    "легкоатлетический манеж",
                    "ледник",
                    "лекторий",
                    "лесопильный цех",
                    "инженерно-бытовой корпус",
                    "инженерно-лабораторный корпус",
                    "инженерный корпус",
                    "институт",
                    "инструментальный цех",
                    "информормационно-вычислительн.центр",
                    "испытательный комплекс",
                    "калориферная станция",
                    "камера задвижек",
                    "канализационно-насосная станция",
                    "капустохранилище",
                    "караульная",
                    "караульное помещение",
                    "касса",
                    "кассовый павильон",
                    "кафе",
                    "кафе,магазин",
                    "кафе-мороженое",
                    "кафе-пельменная",
                    "кафе-столовая",
                    "кафетерий",
                    "кварт.котельная",
                    "киноконцертный зал",
                    "кинолаборатория",
                    "киностудия",
                    "кинотеатр",
                    "кислородная станция",
                    "кислородная-склад",
                    "кладовая",
                    "клуб",
                    "компрессорная",
                    "компрессорная станция",
                    "конденсаторная",
                    "кондиционер",
                    "конечная станция",
                    "конструкторское бюро",
                    "консультативная поликлинника",
                    "контора",
                    "контора и гараж",
                    "контора-склад",
                    "конторское",
                    "контрольно-пропускной пункт",
                    "контрольно-технический пункт",
                    "конференц-зал",
                    "концертный зал",
                    "коньковый павильон",
                    "кормокухня",
                    "душевой комбинат",
                    "домик теннисный",
                    "душевая",
                    "автозаправочная станция",
                    "дворец",
                    "дворец бракосочетания",
                    "дворец культуры",
                    "дворец пионеров",
                    "дворец спорта",
                    "дежурная будка",
                    "дезинфекционная камера",
                    "деловой центр",
                    "депо",
                    "депо трамвайное",
                    "деревообрабатывающая мастерская",
                    "дизельная колонка",
                    "диспетчерская",
                    "диспетчерская и весовая",
                    "дом детского творчества",
                    "дом кино",
                    "дом культуры",
                    "гараж",
                    "гараж и ЦТП",
                    "гараж и бытовое помещение",
                    "гараж и котельная",
                    "гараж и производство",
                    "гараж и проходная",
                    "гараж и склад",
                    "гараж и учреждение",
                    "гараж подземный",
                    "гараж, цех",
                    "гараж,кухня",
                    "гараж,мастерские",
                    "гараж-стоянка",
                    "гаражный блок",
                    "главный корпус",
                    "градирня",
                    "гражданская оборона",
                    "баня",
                    "автомагазин",
                    "автомастерская",
                    "автомобильные весы",
                    "автосервис",
                    "автостоянка",
                    "автостоянка подземная",
                    "автошкола",
                    "агрегатная ТП",
                    "административн. и склад готовой продукц.",
                    "административно-бытовой",
                    "административно-бытовой корпус",
                    "административно-производственное",
                    "административно-производственный корпус",
                    "административно-учебное",
                    "административно-хозяйственный блок",
                    "административно-хозяйственный корпус",
                    "АТС",
                    "АТС и мастерская",
                    "административное",
                    "административное здание",
                    "административное и гараж",
                    "административное и лабораторный корпус",
                    "административный корпус",
                    "административный корпус и котельная",
                    "академия",
                    "аккумуляторная",
                    "ангар",
                    "аптека",
                    "архив",
                    "архив пленки",
                    "архив рентгенопленки",
                    "ателье",
                    "ателье по ремонту",
                    "ателье пошива и ремонта",
                    "ацетиленовая будка",
                    "база",
                    "база-склад",
                    "банк",
                    "банкетный зал",
                    "баня-прачечная",
                    "бассейн и спортзал",
                    "башня",
                    "бензозаправочный пункт",
                    "бетоносмесительный корпус",
                    "библиотека",
                    "биологическая станция",
                    "блинная",
                    "блок вторичного озонирования",
                    "блок подсобных сооружений",
                    "блок-пристройка начальных классов",
                    "блок-станция",
                    "бойлерная",
                    "бойня",
                    "больница",
                    "бомбоубежище",
                    "бройлерная",
                    "будка весовщика",
                    "будка охраны",
                    "булочная-кондитерская",
                    "буфет",
                    "бытовка",
                    "бытовое",
                    "бытовое здание",
                    "бытовое обслуживание",
                    "бытовой корпус",
                    "бытовой цех",
                    "бытовые помещения",
                    "бюро пропусков",
                    "венткамера",
                    "весовая",
                    "ветлечебница",
                    "ветстанция",
                    "виварий",
                    "водомерная будка",
                    "водомерный узел",
                    "водонапорная башня",
                    "водонасосная станция",
                    "водоочистительная станция",
                    "водоприемник",
                    "военкомат",
                    "вольеры для собак",
                    "вспомогательные службы",
                    "вспомогательный корпус",
                    "вторсырье",
                    "выставка",
                    "выставочный зал",
                    "выставочный павильон",
                    "вычислительный центр",
                    "газгольдерная",
                    "газовая котельная",
                    "газогенераторная",
                    "газораспределитель",
                    "газораспределительная станция",
                    "газораспределительное",
                    "газорегуляторный пункт",
                    "газоубежище",
                    "галерея",
                    "ВОХР",
                    "ГАИ",
                    "ГО гражд.обороны",
                    "ГРП",
                    "ГРС",
                    "ГРУ",
                    "ЗРУ-зарядно-распределительное устройство",
                    "КТП",
                    "НИИ",
                    "ОГМ",
                    "ОДС",
                    "ОТК",
                    "ПТУ",
                    "ТП",
                    "ФОК",
                    "ЦТП",
                    "аварийная служба"
                        ].includes(this.objType))
                    {
                        this.socialType = "prom"
                    }
                    else
                    {
                        this.socialType = "mkd"
                    }
            }
        }
    }
}
