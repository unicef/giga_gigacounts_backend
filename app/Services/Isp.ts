import Isp from 'App/Models/Isp'

const listIsps = async (): Promise<Isp[]> => {
  return Isp.all()
}

export default {
  listIsps,
}
