export enum ExecutionStageType {
    assigned = 'Назначен',
    gotoupload='Едет на погрузку',
    waitupload='Ожидает погрузки',
    uploading='Идёт погрузка',
    shipping = 'Перевозка груза',
    waitunload='Ожидает разгрузки',
    unloading='Идёт разгрузка',
    complete = 'Завершен',
    failure = 'Срыв',
    created = 'Создан',
  }
  